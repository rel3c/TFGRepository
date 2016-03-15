/*
 ************************************************************************************
 * Copyright (C) 2015-2016 Openbravo S.L.U.
 * Licensed under the Openbravo Commercial License version 1.0
 * You may obtain a copy of the License at http://www.openbravo.com/legal/obcl.html
 * or in the legal folder of this module distribution.
 ************************************************************************************
 */
package com.openbravo.webservicesimplementation;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;

import jxl.common.Logger;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Class which send Products, Services and Prices examples to Openbravo Web Service.
 * 
 * @author Kepa Choperena
 * 
 */
public class ButSystemClient extends Thread {
  private static final Logger log = Logger.getLogger(ButSystemClient.class);
  private HttpURLConnection connection;
  private BufferedReader inBuffer;
  private OutputStreamWriter outStream;
  private InputStream inStream;
  private Scanner in;
  private boolean exit = false; // Menu exit flag
  private String serverIP, serverPort;
  private double randomValue = 0;
  private JSONObject jsonParam = null;
  private String fileNumber = "", stringResponse = "", sCurrentLine = "", filePath, userOption,
      repetitionsFlag;
  private int repetitionsQuantity;
  private static String USERNAME = "Openbravo";
  private static String PASSWORD = "openbravo";
  byte[] encoding;

  public ButSystemClient(String ip, String port) {
    serverIP = ip;
    serverPort = port;
    String userPassword = USERNAME + ":" + PASSWORD;
    encoding = Base64.encodeBase64(userPassword.getBytes());
  }

  public void run() {
    StringBuilder menuString = new StringBuilder();
    in = new Scanner(System.in);
    menuString.append("BUT SYSTEM SEND MENU\n");
    menuString.append("       1.- Send Product JSON\n");
    menuString.append("       2.- Send Prices JSON\n");
    menuString.append("       3.- Send Services JSON\n");
    menuString.append("       4.- Exit\n");
    while (!exit) {
      System.out.println(menuString.toString());
      userOption = in.nextLine();
      switch (userOption) {
      case "1":
        this.sendProductJSON();
        break;
      case "2":
        this.sendPricesJSON();
        break;
      case "3":
        this.sendServicesJSON();
        break;
      case "4":
        System.out.println("Bye !");
        exit = true;
        break;
      default:
        System.out.println("Incorrect option..try again\n");
      }
    }
  }

  private boolean sendProductJSON() {
    try {
      // Ask user send options
      this.askOptions();

      for (int i = 0; i < repetitionsQuantity; i++) {
        if (userOption.equals("a") || userOption.equals("A")) {
          // Read random product JSON file
          this.readRandomFile("price");
        } else {
          // Read exact product JSON file
          this.readExactFile();
        }
        while ((sCurrentLine = inBuffer.readLine()) != null) {
          stringResponse = stringResponse + sCurrentLine;
        }
        jsonParam = new JSONObject(stringResponse);
        stringResponse = "";

        // Make the connection and send JSON object.
        URL urlProduct = new URL("http://" + serverIP + ":" + serverPort
            + "//openbravo/ws/com.openbravo.but.integration.master.load/product");

        // Get Web Service response
        if (this.sendJSON(urlProduct, jsonParam) != 200) {
          inStream = connection.getErrorStream();
        } else {
          inStream = connection.getInputStream();
        }
        StringWriter writer = new StringWriter();
        IOUtils.copy(inStream, writer);
        String DataJson = writer.toString();
        System.out.println(DataJson);
      }
    } catch (MalformedURLException e) {
      log.error("Malformed URL Exception.", e);
      return false;
    } catch (IOException e) {
      log.error("IOException.", e);
      return false;
    } catch (JSONException e) {
      log.error("JSONException.", e);
    } finally {
      if (connection != null) {
        connection.disconnect();
        return true;
      }
    }
    return false;
  }

  private boolean sendPricesJSON() {
    try {
      // Ask user send options
      this.askOptions();

      for (int i = 0; i < repetitionsQuantity; i++) {
        if (userOption.equals("a") || userOption.equals("A")) {
          // Read random price JSON file
          this.readRandomFile("price");
        } else {
          // Read exact price JSON file
          this.readExactFile();
        }
        while ((sCurrentLine = inBuffer.readLine()) != null) {
          stringResponse = stringResponse + sCurrentLine;
        }
        jsonParam = new JSONObject(stringResponse);
        stringResponse = "";

        // Make the connection and send JSON object.
        URL urlPrices = new URL("http://" + serverIP + ":" + serverPort
            + "//openbravo/ws/com.openbravo.but.integration.master.load/price");

        // Get Web Service response
        if (this.sendJSON(urlPrices, jsonParam) != 200) {
          inStream = connection.getErrorStream();
        } else {
          inStream = connection.getInputStream();
        }
        StringWriter writer = new StringWriter();
        IOUtils.copy(inStream, writer);
        String DataJson = writer.toString();
        System.out.println(DataJson);
      }
    } catch (MalformedURLException e) {
      log.error("Malformed URL Exception.", e);
      return false;
    } catch (IOException e) {
      log.error("IOException.", e);
      return false;
    } catch (JSONException e) {
      log.error("JSONException.", e);
    } finally {
      if (connection != null) {
        connection.disconnect();
        return true;
      }
    }
    return false;
  }

  private boolean sendServicesJSON() {
    try {
      // Ask user send options
      this.askOptions();

      for (int i = 0; i < repetitionsQuantity; i++) {

        if (userOption.equals("a") || userOption.equals("A")) {
          // Read random service JSON file
          this.readRandomFile("service");
        } else {
          // Read exact service JSON file
          this.readExactFile();
        }
        while ((sCurrentLine = inBuffer.readLine()) != null) {
          stringResponse = stringResponse + sCurrentLine;
        }
        jsonParam = new JSONObject(stringResponse);
        stringResponse = "";

        // Make the connection and send JSON object.
        URL urlServices = new URL("http://" + serverIP + ":" + serverPort
            + "//openbravo/ws/com.openbravo.but.integration.master.load/service");

        // Get Web Service response
        if (this.sendJSON(urlServices, jsonParam) != 200) {
          inStream = connection.getErrorStream();
        } else {
          inStream = connection.getInputStream();
        }
        StringWriter writer = new StringWriter();
        IOUtils.copy(inStream, writer);
        String DataJson = writer.toString();
        System.out.println(DataJson);
      }
    } catch (MalformedURLException e) {
      log.error("Malformed URL Exception.", e);
      return false;
    } catch (IOException e) {
      log.error("IOException.", e);
      return false;
    } catch (JSONException e) {
      log.error("JSONException.", e);
    } finally {
      if (connection != null) {
        connection.disconnect();
        return true;
      }
    }
    return false;
  }

  private int sendJSON(URL url, JSONObject jsonParam) {
    try {
      connection = (HttpURLConnection) url.openConnection();
      connection.setDoOutput(true);
      connection.setDoInput(true);
      connection.setRequestMethod("POST");
      connection.setRequestProperty("Content-Type", "application/json");
      connection.setRequestProperty("Authorization", "Basic " + (new String(encoding)));
      connection.connect();
      outStream = new OutputStreamWriter(connection.getOutputStream());
      outStream.write(jsonParam.toString());
      outStream.close();
      return connection.getResponseCode();
    } catch (IOException e) {
      log.error("IOException.", e);
      e.printStackTrace();
      return 404;
    }
  }

  private void askOptions() {
    do {
      System.out.println("¿ Select aleatory or exact JSON ?(a/e)");
      userOption = in.nextLine();
    } while (!userOption.equals("a") && !userOption.equals("A") && !userOption.equals("E")
        && !userOption.equals("e"));
    do {
      System.out.println("¿ Do you want to send JSON X times ?(y/n)");
      repetitionsFlag = in.nextLine();
    } while (!repetitionsFlag.equals("y") && !repetitionsFlag.equals("Y")
        && !repetitionsFlag.equals("n") && !repetitionsFlag.equals("N"));
    if (repetitionsFlag.equals("y") || repetitionsFlag.equals("Y")) {
      System.out.print("Times: ");
      repetitionsFlag = in.nextLine();
      repetitionsQuantity = Integer.parseInt(repetitionsFlag);
    }
  }

  private void readRandomFile(String type) {
    try {
      randomValue = Math.random();
      if (randomValue >= 0.66) {
        fileNumber = "1";
      } else if (randomValue >= 0.33) {
        fileNumber = "2";
      } else if (randomValue >= 0) {
        fileNumber = "3";
      }
      filePath = new File("").getAbsolutePath();
      filePath = filePath + "/files/arc-response-" + type + fileNumber + ".json";
      inBuffer = new BufferedReader(new FileReader(filePath));
    } catch (FileNotFoundException e) {
      log.error("FileNotFoundException.", e);
    }
  }

  private void readExactFile() {
    try {
      filePath = "";
      System.out.print("Type file name: ");
      userOption = in.nextLine();
      filePath = new File("").getAbsolutePath();
      filePath = filePath + "/files/" + userOption;
      inBuffer = new BufferedReader(new FileReader(filePath));
    } catch (FileNotFoundException e) {
      log.error("FileNotFoundException.", e);
    }
  }
}
