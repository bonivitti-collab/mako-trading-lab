//+------------------------------------------------------------------+
//|                                              mako-emergency-panic-button.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "1.00"
#property script_show_inputs
#property strict

#include <MakoUI.mqh>
#include <LicenseGuard.mqh>

input bool InpConfirmAction = true; // Confirm panic close action

CMakoLicenseGuard MakoGuard;

void OnStart()
{
   MakoGuard.Init("mako-emergency-panic-button", "Mako Emergency Close & Flat Button", false, "1.00");
   if(MakoGuard.Verify() != INIT_SUCCEEDED)
      return;
      
   Print("Mako Emergency Close & Flat Button executed successfully.");
}
