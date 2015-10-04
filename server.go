package main

import (
	"bufio"
	"flag"
	"fmt"
	"github.com/tarm/serial"
	"github.com/gorilla/websocket"
	"sync"
	"log"
	"net/http"
	"time"
)


var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

type Server struct {
	conns map[*websocket.Conn]bool
	rwl *sync.RWMutex
}

func (s *Server) init() {
	s.conns = make(map[*websocket.Conn]bool);
	s.rwl = &sync.RWMutex{}
}

func (s *Server) handleClientConnection(w http.ResponseWriter, r *http.Request) {
	log.Println("Got connection!")
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", 405)
		return
	}
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	s.rwl.Lock()
	s.conns[ws] = true
	s.rwl.Unlock()
	
	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			break
		}
	}
	
	log.Println("Removed connection!")
	s.rwl.Lock()
	delete(s.conns, ws)
	s.rwl.Unlock()
}

func (s *Server) broadcast(message string) {
	s.rwl.RLock()
	for conn, _ := range s.conns {
		conn.WriteMessage(websocket.TextMessage, []byte(message))
	}
	s.rwl.RUnlock()
}

func (s *Server) setupSerialProxy(c *serial.Config) {
	return
	
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
	server.init()
	
	c := &serial.Config{Name: *serialPort, Baud: *baudRate}
	go server.setupSerialProxy(c)
	go server.setupKeepAlive()

	log.Printf("Proxying from serial port %s to websocket url %s:%d%s \n", *serialPort, *httpHost, *httpPort, *websocketUrl)
	http.HandleFunc(*websocketUrl, server.handleClientConnection)
	err := http.ListenAndServe(fmt.Sprintf("%s:%d", *httpHost, *httpPort), nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
