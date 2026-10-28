//+------------------------------------------------------------------+
//|                                              mako-delta-divergence-scalper-ea.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "2.30"
#property strict

#include <Trade\Trade.mqh>
#include <MakoUI.mqh>
#include <LicenseGuard.mqh>

input group "--- Risk & Order Management ---"
input double InpRiskPercent    = 1.0;   // Risk per Trade (%)
input double InpStopLossATR    = 1.5;   // Stop Loss (ATR Multiplier)
input double InpTakeProfitRR   = 2.0;   // Risk to Reward Ratio (1:X)
input ulong  InpMagicNumber    = 884422;// Magic Number

input group "--- UI & Display Settings ---"
input bool   InpShowHUD        = true;  // Display Mako HUD

CTrade            MakoTrade;
CMakoUI           MakoDisplay("mako-delta-divergence-scalper-ea");
CMakoLicenseGuard MakoGuard;

int OnInit()
{
   MakoTrade.SetExpertMagicNumber(InpMagicNumber);
   
   MakoGuard.Init("mako-delta-divergence-scalper-ea", "Mako Automated Delta Divergence Scalper EA", true, "2.30");
   if(MakoGuard.Verify() != INIT_SUCCEEDED)
      return(INIT_FAILED);
      
   if(InpShowHUD)
   {
      MakoDisplay.CreatePanel("Mako Automated Delta Divergence Scalper EA", "PRO");
      MakoDisplay.SetRow(0, "Bot Status", "RUNNING", CLR_MAKO_BULL);
      MakoDisplay.SetRow(1, "Risk/Trade", DoubleToString(InpRiskPercent, 1) + "%", CLR_MAKO_ACCENT);
      MakoDisplay.SetRow(2, "Magic ID", IntegerToString(InpMagicNumber), CLR_MAKO_MUTED);
   }
   
   PrintFormat("[Mako EA] %s v%s initialized successfully.", "Mako Automated Delta Divergence Scalper EA", "2.30");
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   MakoDisplay.Destroy();
   MakoGuard.CleanBanner();
}

void OnTick()
{
   static datetime lastBarTime = 0;
   datetime currentBarTime = iTime(_Symbol, _Period, 0);
   if(currentBarTime == lastBarTime)
      return;
   lastBarTime = currentBarTime;
   
   if(InpShowHUD)
   {
      double equity = AccountInfoDouble(ACCOUNT_EQUITY);
      MakoDisplay.SetRow(3, "Equity", DoubleToString(equity, 2), CLR_MAKO_TEXT);
   }
}
