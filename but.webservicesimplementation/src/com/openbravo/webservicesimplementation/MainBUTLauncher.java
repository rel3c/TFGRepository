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
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Scanner;

import jxl.common.Logger;

/**
 * Class which launch Fake system BUT client and Openbravo client.
 * 
 * @author Kepa Choperena
 * 
 */
public class MainBUTLauncher {
  private static final Logger log = Logger.getLogger(MainBUTLauncher.class);

  public static void main(String args[]) {
    Scanner in = new Scanner(System.in);
    String client = ""; // Client type (B/b = BUT or o/O = Openbravo)
    PrintWriter writer; // Config file writer
    BufferedReader br; // Config file reader
    String sCurrentLine, configDefaultIp, defaultIp = "", ip;
    try {
      do {
        System.out.print("¿ Init BUT Client or Openbravo Client(B/O)(empty = BUT)?");
        client = in.nextLine();
        if (client.equals("")) {
          client = "B";
        }
      } while (!client.equals("o") && !client.equals("O") && !client.equals("B")
          && !client.equals("b"));

      if (client.equals("B") || client.equals("b")) {
        ButSystemClient butClient;
        System.out.print("¿ Configure Openbravo Web Services default IP ? (y/n)");
        configDefaultIp = in.nextLine();
        if (configDefaultIp.equals("y")) {
          System.out.print("Enter Openbravo Web Services default IP:");
          configDefaultIp = in.nextLine();
          writer = new PrintWriter("./.ipOpenbravo.config", "UTF-8");
          writer.println(configDefaultIp);
          writer.close();
        }

        // Read ip from config file
        br = new BufferedReader(new FileReader("./.ipOpenbravo.config"));
        while ((sCurrentLine = br.readLine()) != null) {
          defaultIp = sCurrentLine;
        }
        // Config WS Ip
        System.out.print("Enter Openbravo Web Services IP (empty = default) :");
        ip = in.nextLine();
        if (ip.equals("")) {
          ip = defaultIp;
        }
        // Config WS port
        System.out.print("Enter Openbravo Web Services port (empty = 80) :");
        String port = in.nextLine();
        if (port.equals("")) {
          port = "80";
        }
        butClient = new ButSystemClient(ip, port);
        butClient.start();
      } else {
        OpenbravoSystemClient openbravoClient;
        System.out.print("¿ Configure BUT Web Services default IP ? (y/n)");
        configDefaultIp = in.nextLine();
        if (configDefaultIp.equals("y")) {
          System.out.print("Enter BUT Web Services default IP:");
          configDefaultIp = in.nextLine();
          writer = new PrintWriter("./.ipBut.config", "UTF-8");
          writer.println(configDefaultIp);
          writer.close();
        }
        // Read ip from config file
        br = new BufferedReader(new FileReader("./.ipBut.config"));
        while ((sCurrentLine = br.readLine()) != null) {
          defaultIp = sCurrentLine;
        }
        // Config WS Ip
        System.out.print("Enter BUT Web Services IP (empty = default) :");
        ip = in.nextLine();
        if (ip.equals("")) {
          ip = defaultIp;
        }
        // Config WS port
        System.out.print("Enter BUT Web Services port (empty = 31300) :");
        String port = in.nextLine();
        if (port.equals("")) {
          port = "31300";
        }
        openbravoClient = new OpenbravoSystemClient(ip, port);
        openbravoClient.start();
      }
    } catch (FileNotFoundException e) {
      log.error("File not found exception.", e);
    } catch (UnsupportedEncodingException e) {
      log.error("Unsupported Encoding Exception.", e);
    } catch (IOException e) {
      log.error("IOException.", e);
    }
  }
}
