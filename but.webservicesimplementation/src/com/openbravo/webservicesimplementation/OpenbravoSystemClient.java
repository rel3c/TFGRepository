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

import org.apache.commons.io.IOUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

/**
 * Class which send Orders examples to But Web Service and send request to get nomenclature JSON.
 * 
 * @author Kepa Choperena
 * 
 */
public class OpenbravoSystemClient extends Thread {
  private static final Logger log = Logger.getLogger(OpenbravoSystemClient.class);
  private HttpURLConnection con;
  private BufferedReader inBuffer;
  private OutputStreamWriter outStream;
  private InputStream inStream;
  boolean exit = false;
  private String serverIP, serverPort;
  private double randomValue = 0;
  private String fileNumber = "";
  private JSONObject jsonParam = null;
  private String stringResponse = "", sCurrentLine = "", filePath, userOption, repetitionsFlag;
  private int repetitionsQuantity;
  private Scanner in;

  public OpenbravoSystemClient(String ip, String port) {
    serverIP = ip;
    serverPort = port;
  }

  public void run() {
    StringBuilder menuString = new StringBuilder();
    in = new Scanner(System.in);
    menuString.append("OPENBRAVO SYSTEM SEND MENU\n");
    menuString.append("     1.- Get Product Category JSON\n");
    menuString.append("     2.- Send Order Entity JSON\n");
    menuString.append("     3.- Exit\n");
    while (!exit) {
      System.out.println(menuString.toString());
      userOption = in.nextLine();
      switch (userOption) {
      case "1":
        this.getProductCategoryJSON();
        break;
      case "2":
        this.sendOrderEntityJSON();
        break;
      case "3":
        System.out.println("Bye !");
        exit = true;
        break;
      default:
        System.out.println("Incorrect option..try again\n");
      }
    }
  }

  private boolean getProductCategoryJSON() {
    try {
      URL urlProductCategory = new URL("http://" + serverIP + ":" + serverPort
          + "/rest/BUT_WS_Nomenclature/v1_0/services/pub/nomenclature/Domaine");
      System.out.println(urlProductCategory);
      con = (HttpURLConnection) urlProductCategory.openConnection();
      con.setDoOutput(true);
      con.setDoInput(true);
      con.setRequestMethod("POST");
      con.setRequestProperty("Content-Type", "application/json");
      con.connect();

      // Read JSONObject from file and send
      outStream = new OutputStreamWriter(con.getOutputStream());
      outStream.write("Handshake");
      outStream.close();

      // Web Service response
      if (con.getResponseCode() != 200) {
        inStream = con.getErrorStream();
      } else {
        inStream = con.getInputStream();
      }
      StringWriter writer = new StringWriter();
      IOUtils.copy(inStream, writer);
      String DataJson = writer.toString();
      System.out.println(DataJson);

    } catch (MalformedURLException e) {
      log.error("Malformed URL Exception.", e);
      return false;
    } catch (IOException e) {
      log.error("IOException.", e);
      return false;
    } finally {
      if (con != null) {
        con.disconnect();
        return true;
      }
    }
    return false;
  }

  private boolean sendOrderEntityJSON() {
    try {
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
      for (int i = 0; i < repetitionsQuantity; i++) {
        // ¿ Get random JSON file or exact to send?
        if (userOption.equals("a") || userOption.equals("A")) { // Read random product JSON file
          randomValue = Math.random();
          if (randomValue >= 0.66) {
            fileNumber = "1";
          } else if (randomValue >= 0.33) {
            fileNumber = "2";
          } else if (randomValue >= 0) {
            fileNumber = "3";
          }
          filePath = new File("").getAbsolutePath();
          filePath = filePath + "/files/arc-response-product" + fileNumber + ".json";
          inBuffer = new BufferedReader(new FileReader(filePath));
        } else { // Read exact product JSON file
          filePath = "";
          System.out.print("Type file name: ");
          userOption = in.nextLine();
          filePath = new File("").getAbsolutePath();
          filePath = filePath + "/files/" + userOption;
          inBuffer = new BufferedReader(new FileReader(filePath));
        }
        while ((sCurrentLine = inBuffer.readLine()) != null) {
          stringResponse = stringResponse + sCurrentLine;
        }
        jsonParam = new JSONObject(stringResponse);
        stringResponse = "";

        // Make the connection and send JSON object.
        URL urlOrderEntity = new URL("http://" + serverIP + ":" + serverPort
            + "/rest/BUT_SaleOrder/v1_0/services/pub/SaleOrder");
        con = (HttpURLConnection) urlOrderEntity.openConnection();
        con.setDoOutput(true);
        con.setDoInput(true);
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.connect();
        outStream = new OutputStreamWriter(con.getOutputStream());
        outStream.write(jsonParam.toString());
        outStream.close();

        // Web Service response
        if (con.getResponseCode() != 200) {
          inStream = con.getErrorStream();
        } else {
          inStream = con.getInputStream();
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
      if (con != null) {
        con.disconnect();
        return true;
      }
    }
    return false;
  }
}
