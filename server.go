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
	"io"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

type Conn struct {
	Mutex *sync.Mutex
	Ws *websocket.Conn
}

type Server struct {
	From io.Reader
	conns map[*Conn]bool
	rwl *sync.RWMutex
}

func (s *Server) init() {
	s.conns = make(map[*Conn]bool);
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
	
	conn := &Conn{ Ws: ws, Mutex: &sync.Mutex{}}
	s.rwl.Lock()
	s.conns[conn] = true
	s.rwl.Unlock()
	
	for {
		_, _, err := ws.ReadMessage()
		if err != nil {
			log.Println(err)
			break
		}
	}
	
	log.Println("Removed connection!")
	s.rwl.Lock()
	delete(s.conns, conn)
	s.rwl.Unlock()
}

func (s *Server) broadcast(message string) {
	s.rwl.RLock()
	
	log.Println("Broadcasting: " + message)
	for conn, _ := range s.conns {
		conn.Mutex.Lock()
		if err := conn.Ws.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
			log.Println(err)
		}
		conn.Mutex.Unlock()
	}
	s.rwl.RUnlock()
}

func (s *Server) proxy() {
	scanner := bufio.NewScanner(s.From)
	for scanner.Scan() {
		s.broadcast(scanner.Text())
	}
	fmt.Println("Done")
}

func (s *Server) keepAlive() {
	ticker := time.NewTicker(5 * time.Second)
	for _ = range ticker.C {
		s.rwl.RLock()
		for conn, _ := range s.conns {
			conn.Ws.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(30 * time.Second))
		}
		s.rwl.RUnlock()
	}
}

func testCommands(p *io.PipeWriter) {
	commands := []string{"k021022\n", "k201222\n", "k202121\n", "k211022\n", "k102102\n", "k100220\n", "k001021\n", "k201011\n", "r101\n"}
	ticker := time.NewTicker(5 * time.Second)
	
	i := 0
	for _ = range ticker.C {
		io.WriteString(p, commands[i % len(commands)])
		i++
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
	
	c := &serial.Config{Name: *serialPort, Baud: *baudRate}
	fmt.Println(c)
	
	p, err := serial.OpenPort(c)
	if err != nil {
		log.Fatal(err)
	}
	// pr, pw := io.Pipe()
	server := &Server{From: p}
	server.init()
	

	go server.keepAlive()
	go server.proxy()
	// go testCommands(pw)
	
	log.Printf("Proxying from serial port %s to websocket url %s:%d%s \n", *serialPort, *httpHost, *httpPort, *websocketUrl)
	http.HandleFunc(*websocketUrl, server.handleClientConnection)
	err = http.ListenAndServe(fmt.Sprintf("%s:%d", *httpHost, *httpPort), nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}


