package bonus;

import java.io.*;
import java.net.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Random;

public class Server {

    private final int port = 8989;

    public static void main(String[] args) {
        new Server();
    }

    // used to make html file to string :O
    public String loadHTMLFromFile(String filename) {
        File html = new File(filename);
        String abspath = html.getAbsolutePath();
        Path path = Path.of(abspath);

        String str;
        try {
            str = Files.readString(path);
            return str;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }

    public void processGet(BufferedWriter out, String cookie, String body) throws IOException {
        String payload;
        if (body.equals("")) {
            payload = loadHTMLFromFile("guess.html");
        } else {
            payload = body;
        }

        String response = "HTTP/1.1 200 OK\nSet-Cookie: " + cookie + "\nContent-Length: " + payload.length()
                + "\nContent-Type: text/html\n\n";
        out.write(response);
        out.write(payload);
        out.flush();
    }

    public String generateCookie() {
        Random rand = new Random();
        int randNum = rand.nextInt(1000);
        String newCookie = "playerID=" + randNum;

        return newCookie;
    }

    public String getCoockie(String headers) {
        String cookie = headers.substring(headers.indexOf("Cookie: ") + "Cookie: ".length());
        cookie = cookie.substring(0, cookie.indexOf("\n"));
        cookie = cookie.strip();

        return cookie;
    }

    public String fetchPayload(BufferedReader in, String headers) throws IOException {
        int content_length = Integer.parseInt((((headers.split("Content-Length: "))[1]).split("\n"))[0]);
        char[] cbuf = new char[content_length];
        in.read(cbuf, 0, content_length);
        String payload = new String(cbuf);
        // For debugging
        System.out.println(payload);

        return payload;
    }
    
    public String updateHTML(String html, GuessGame g) {
        html = this.loadHTMLFromFile(html);

        String[] bounds = g.getBounds();
        String lower = bounds[0];
        String upper = bounds[1];
        String guesses = Integer.toString(g.getGuesses());

        String updatedHTML = html.replace("$lower_bound$", lower);
        updatedHTML = updatedHTML.replace("$upper_bound$", upper);
        updatedHTML = updatedHTML.replace("$guesses$", guesses);
        
        return updatedHTML;
    }

    public boolean detectCT(String ipAddress, String cookie, HashMap<String, String> ips) {
        System.out.println(ips.get(cookie));
        System.out.println(ipAddress);

        if (!ips.get(cookie).equals(ipAddress)) {
            return true;
        }
        return false;
    }

    public Server() {
        try (ServerSocket serverSocket = new ServerSocket(this.port)) {
            System.out.println("Listening on port: " + this.port);
            // Map ip to cookie
            HashMap<String, String> ips = new HashMap<>();
            // Map cookie to game
            HashMap<String, GuessGame> games = new HashMap<>();

            while (true) {
                try (Socket socket = serverSocket.accept();
                        BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()))) {
                    // get clientIp
                    InetSocketAddress socketAddress = (InetSocketAddress) socket.getRemoteSocketAddress();
                    String clientIpAddress = socketAddress.getAddress().getHostAddress();

                    String headers = "";
                    String line = in.readLine();

                    while (!line.equals("")) {
                        System.out.println(" <<< " + line); // log
                        headers += line + "\n";
                        line = in.readLine();
                    }
                    if (headers.indexOf("GET") == 0) {
                        String cookie;
                        GuessGame g;
                        // For new player/cookie
                        if (!headers.contains("Cookie:")) {
                            cookie = this.generateCookie();
                            g = new GuessGame();
                            games.put(cookie, g);
                            ips.put(cookie, clientIpAddress);
                        // Here is attack
                        } else {
                            cookie = this.getCoockie(headers);
                            g = games.get(cookie);
                            // Bad bug fix
                            if (g == null) {
                                g = new GuessGame();
                                games.put(cookie, g);
                            }
                        }
                        // Fix for cookie theft
                        if (ips.get(cookie) == null || this.detectCT(clientIpAddress, cookie, ips)) {
                                String response = "HTTP/1.1 303 See Other\nLocation: http://localhost:8989"
                                        + "\nSet-Cookie: " + cookie + "; Max-Age=-1n\n\n";
                                out.write(response);
                                out.flush();
                        // Fix for win page refresh
                        } else if (headers.contains("won")) {
                            String response = "HTTP/1.1 303 See Other\nLocation: http://localhost:8989"
                                    + "\nSet-Cookie: " + cookie + "; Max-Age=-1n\n\n";
                            games.remove(cookie);
                            ips.remove(cookie);
                            out.write(response);
                            out.flush();
                        } else if (this.detectCT(clientIpAddress, cookie, ips)) {
                                String response = "HTTP/1.1 303 See Other\nLocation: http://localhost:8989"
                                        + "\nSet-Cookie: " + cookie + "; Max-Age=-1n\n\n";
                                out.write(response);
                                out.flush();
                        } else if (!g.getGameStatus()) {
                            String payload = this.updateHTML("guess.html", g);
                            this.processGet(out, cookie, payload);
                        } else {
                            String payload = this.loadHTMLFromFile("won.html").replace("$guesses$",
                                    Integer.toString(g.getGuesses()));
                            String response = "HTTP/1.1 200 OK\nSet-Cookie: " + cookie + "\nContent-Length: "
                                    + payload.length() + "\nContent-Type: text/html\n\n";
                            out.write(response);
                            out.write(payload);
                            out.flush();
                        }

                    } else if (headers.indexOf("POST") == 0) {
                        // Send server back to get
                        out.write("HTTP/1.1 303 See Other\nLocation: /\n\n");
                        String cookie = this.getCoockie(headers);
                        GuessGame g = games.get(cookie);
                        // Bad bug fix
                        if (g == null) {
                            g = new GuessGame();
                            games.put(cookie, g);
                        }
                        String payload = this.fetchPayload(in, headers);
                        try {
                            int guess = Integer.parseInt(payload.split("=")[1]);
                            g.guess(guess);
                            // Non ints and some random null bug
                        } catch (NumberFormatException | ArrayIndexOutOfBoundsException e) {
                            e.printStackTrace();
                        }
                        out.flush();
                        System.out.println(g.getCorrect());
                    }
                    System.out.println(" >>> " + "HTTP RESPONSE"); // log
                    out.write("HTTP RESPONSE"); // write
                    out.flush(); // flush

                } catch (IOException e) {
                    System.err.println(e.getMessage());
                }

            }
        } catch (IOException e) {
            System.err.println(e.getMessage());
            System.err.println("Could not listen on port: " + this.port);
            System.exit(1);
        }
    }
}
