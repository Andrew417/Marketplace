/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.marketplace.bridge;

import java.io.*;
import java.net.Socket;

/**
 *
 * @author Arsany
 */
public class TcpClient {
    private Socket socket;
    private PrintWriter out;
    private BufferedReader in;
    
    public void connect(String host, int port) throws IOException{
        this.socket = new Socket(host, port);
        this.out = new PrintWriter(socket.getOutputStream(), true);
        this.in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }
    public void send(String message){
        out.print(message);
    }
    public String receive() throws IOException{
        return in.readLine();
    }
    public void close() throws IOException{
        if (socket!= null)
            socket.close();
    }
}
