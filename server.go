package main

import (
	"bufio"
	"flag"
	"fmt"
	"github.com/tarm/serial"
	"golang.org/x/net/websocket"
	"log"
	"net/http"
	"time"
)

type Client struct {
	ws *websocket.Conn
}

type Server struct {
	conns []*websocket.Conn
}

func (s *Server) init() {
	s.conns = make([]*websocket.Conn, 0)
}

func (s *Server) handleClientConnection(conn *websocket.Conn) {
	s.conns = append(s.conns, conn)
}

func (s *Server) broadcast(message string) {
	for _, conn := range s.conns {
		websocket.Message.Send(conn, message)
	}
}

func (s *Server) setupSerialProxy(c *serial.Config) {
	p, err := serial.OpenPort(c)
	if err != nil {
		log.Fatal(err)
	}

	scanner := bufio.NewScanner(p)
	for scanner.Scan() {
		s.broadcast(scanner.Text())
	}
}

func (s *Server) setupKeepAlive() {
	ticker := time.NewTicker(5 * time.Second)
	for _ = range ticker.C {
		s.broadcast("KEEP-ALIVE")
	}
}

func main() {
	serialPort := flag.String("port", "", "Port to use for serial communication (COM4, COM5, /path/to/serial/file, etc)")
	baudRate := flag.Int("baud", 115200, "Baud rate for serial port")

	httpHost := flag.String("httpHost", "", "HTTP host")
	httpPort := flag.Int("httpPort", 8752, "HTTP port")
	websocketUrl := flag.String("webUrl", "/scary", "Url for websocket communication")

	flag.Parse()
	if *serialPort == "" {
		log.Fatalln("Serial port is required! Use --help for more info")
	}

	server := &Server{}
	c := &serial.Config{Name: *serialPort, Baud: *baudRate}
	go server.setupSerialProxy(c)
	go server.setupKeepAlive()

	log.Printf("Proxying from serial port %s to websocket url %s:%d%s \n", *serialPort, *httpHost, *httpPort, *websocketUrl)
	http.Handle(*websocketUrl, websocket.Handler(server.handleClientConnection))
	err := http.ListenAndServe(fmt.Sprintf("%s:%d", *httpHost, *httpPort), nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
