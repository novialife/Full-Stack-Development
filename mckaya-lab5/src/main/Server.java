package main;
import java.io.*;
import java.net.*;
import java.security.KeyStore;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLServerSocket;
import javax.net.ssl.SSLServerSocketFactory;
import javax.net.ssl.SSLSocket;



class Server{

	private PrintWriter out;
	private BufferedReader in;	
	
	public Server() throws Exception{		

		HashMap<String, String> ipMap = new HashMap<String, String>();	// For mapping IPs to Cookies
		HashMap<String, Game> gameMap = new HashMap<String, Game>();	// For mapping Cookies to GameStates
		String cookie = "";
		String currentPage = "welcome.html";	// Initialize with welcome page

		try{
			KeyStore ks = KeyStore.getInstance("JKS"); // Create a keystore that facilitates certificates.
			InputStream is = null;
			is = new FileInputStream(new File("C:/Users/Mervan/Documents/Onedrive/DD1389/intnet22-labb1and5/lab5.jks")); // Load the keystore
			ks.load(is,"test123".toCharArray()); // Connect it to the KeyStore object using the keystore password. This is not secure!! As explained in the report.
			
			KeyManagerFactory kmf = null;
			kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());	// Class that manages keys based on the KeyStore
			kmf.init(ks,"test123".toCharArray());	// Initialize the factory using the KeyStore and the password. Not secure!!
			KeyManager km[] = kmf.getKeyManagers();
			
			SSLContext sslContext=null;
			sslContext = SSLContext.getInstance("TLS");	// Represents the SSL protocol. This is initialized with the TLS protocol.
			sslContext.init(km, null, null); // Is initalized with the keymanager
			SSLServerSocketFactory ssf = (SSLServerSocketFactory) sslContext.getServerSocketFactory(); // Factory that creates SSLServerSockets.
			
			SSLServerSocket ss = null;
			ss = (SSLServerSocket)ssf.createServerSocket(1234);	// Create a SSLServerSocket using the factory with the port 1234 on localhost.
			SSLSocket client =(SSLSocket)ss.accept();		// Accept the client.
			
			while (true){
			
				this.in = new BufferedReader(new InputStreamReader(client.getInputStream()));
				this.out = new PrintWriter(client.getOutputStream(), true);

				InetSocketAddress socketAddress = (InetSocketAddress) client.getRemoteSocketAddress();	// Get the IP
				String clientIpAddress = socketAddress.getAddress().getHostAddress();
				System.out.println(cookie);
				// Parse the header
				String line = in.readLine();
				String header = "";

				while (!line.equals("")){
					header += line+"\n";
					line=in.readLine();
				}

				if(header.indexOf("GET") == 0){
					// We have a GET request
					Game currGame;
					if (header.contains("Cookie:")){
						cookie = getCookie(header);
						if (gameMap.get(cookie) == null){
							// If no mapped game to cookie, make a new game and map it
							currGame = new Game(); 
							gameMap.put(cookie, currGame);
							ipMap.put(cookie, clientIpAddress);
						}else{
							currGame = gameMap.get(cookie);
						}

					}else{
						// If no cookie, create a new one
						cookie = newCookie();
						currGame = new Game();
						gameMap.put(cookie, currGame);
						ipMap.put(cookie, clientIpAddress);

					}
					if (ipMap.get(cookie) == null || this.theft(clientIpAddress, cookie, ipMap)) {
						// If we have no mapped cookie to the IP, or if it is a theft
						String response = "HTTP/1.1 303 See Other\nLocation: https://localhost:1234" + "\nSet-Cookie: " + cookie + "; Max-Age=-1n\n\n";
						out.println(response);
						currentPage = "welcome.html";
					}
					else if (header.contains("correctguess")){
						// If the user clicked the new game link, remove the game and the cookie, and remove the IP. Redirect to welcome page
						String response = "HTTP/1.1 303 See Other\nLocation: https://localhost:1234"
						+ "\nSet-Cookie: " + cookie + "; Max-Age=-1n\n\n";
						gameMap.remove(cookie);
						ipMap.remove(cookie);
						out.println(response);
						currentPage = "welcome.html";
					
					} 
					else {
						// Get the payload and change the bounds. Send the user the next page GET-response
						List<String> payload = (List<String>) readFile(currentPage).get(0);
						int payLength = (int) readFile(currentPage).get(1);
						List<Integer> currBounds = currGame.getBounds();
						payload = changeBounds(payload, currBounds.get(0).toString(), currBounds.get(1).toString(), currGame.getNumGuesses());
						sendPage(payload, cookie, payLength);
					}

				}else if(header.indexOf("POST") == 0){
					// We have POST request

					String reqPay = getPayload(header);	
					
					cookie = getCookie(header);
					Game currGame = gameMap.get(cookie);	// Get the current game


					int indexEquals = reqPay.indexOf("=");
					int diff = reqPay.length() - (indexEquals+1);
					String guess = reqPay.substring(reqPay.length()-diff);	// process the guess
					
					if(currGame.correctGuess(guess)){	// If correct
						System.out.println("Correct!");
						currGame.setStatus(false);
						currentPage = "correctguess.html";

					}else if(currGame.inRange(guess)){	// if in range but wrong
						currGame.changeBound(guess);
						currGame.incGuess();
						System.out.println("Wrong answer");
						currentPage = "wrongguess.html";
					}else{	// if completely wrong
						System.out.println("Wrong input!");
						currentPage = "wronginput.html";
					}
					this.out.println("HTTP/1.1 303 See Other\nLocation: https://localhost:1234\n\n");	// Redirect with 303 See Other, PRG
				}
				client.close();
				client =(SSLSocket)ss.accept();
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
	}
	
	
	private boolean theft(String IP, String cookie, HashMap<String, String> ipMap) {
		if (!ipMap.get(cookie).equals(IP)) {	// If IP matches the cookie, then no theft. Else theft
			return true;
		}
		return false;
	}

	private List<String> changeBounds(List<String> payload, String lowerBound, String upperBound, Integer NumOfGuesses){
		List<String> newPayload = new ArrayList<String>();
		for (String line: payload){
			if (line.contains("$LOWER") || line.contains("$UPPER")){
				line = line.replace("$LOWER", lowerBound);
				line = line.replace("$UPPER", upperBound);
			}else if (line.contains("$NUMOFGUESSES")){
				line = line.replace("$NUMOFGUESSES", NumOfGuesses.toString());
			}
			newPayload.add(line);
		}
		return newPayload;
	}

	// Form with Cookie by Vahid
	private String newCookie(){
		Random random = new Random();
		int SESSION_ID = random.nextInt(999999);
		return "SESSION_ID=" + SESSION_ID;
	}

	// Form with Cookie by Vahid
	private String getCookie(String headers){
		String cookie = headers.substring(headers.indexOf("Cookie: ") + "Cookie: ".length());
        cookie = cookie.substring(0, cookie.indexOf("\n"));
        cookie = cookie.strip();
		cookie = cookie.substring(cookie.indexOf(";")+2, cookie.length());
		return cookie;
	}

	// Form with Cookie by Vahid
	private String getPayload(String header) throws IOException{
		int contLength= Integer.parseInt((((header.split("Content-Length: "))[1]).split("\n"))[0]);
		char[] c = new char[contLength];
		this.in.read(c, 0, contLength);
		return new String(c);
	}

	// I made the HTML file be a list. Probably not needed but whatever
	private List<Object> readFile(String filename) throws Exception{
		BufferedReader data = new BufferedReader(new FileReader(filename));

		List<String> contents = new ArrayList<String>();
		String line = "";
		int payLength = 0;
		while ((line = data.readLine()) != null){
			contents.add(line);
			payLength += line.length();
		}

		data.close();
		return Arrays.asList(contents, payLength);
	}

	// Send the pages for the GET responses with 200 OK and HTML page as payload
	private void sendPage(List<String> pageHTML, String cookie, int payLength) throws Exception{
		this.out.println("HTTP/1.1 200 OK\nSet-Cookie: " + cookie + "\nContent-Length: " + payLength + "\nContent-Type: text/html\n\n");
		for (String s: pageHTML){	// Payload
			out.println(s);
		}
	}

	public static void main(String[] args) throws Exception{
    	new Server();
	}
}
