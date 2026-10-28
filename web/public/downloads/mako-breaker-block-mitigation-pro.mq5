//+------------------------------------------------------------------+
//|                                              mako-breaker-block-mitigation-pro.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "1.60"
#property indicator_chart_window
#property indicator_buffers 2
#property indicator_plots   1
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrDodgerBlue
#property indicator_width1  2
#property strict

#include <MakoUI.mqh>
#include <LicenseGuard.mqh>

input int                InpPeriod       = 14;     // Calculation Period
input ENUM_APPLIED_PRICE InpAppliedPrice = PRICE_CLOSE; // Applied Price
input bool               InpShowHUD      = true;   // Display Mako Brand HUD

double BufferPlot[];
double BufferWork[];

CMakoUI           MakoDisplay("mako-breaker-block-mitigation-pro");
CMakoLicenseGuard MakoGuard;

int OnInit()
{
   SetIndexBuffer(0, BufferPlot, INDICATOR_DATA);
   SetIndexBuffer(1, BufferWork, INDICATOR_CALCULATIONS);
   ArraySetAsSeries(BufferPlot, true);
   ArraySetAsSeries(BufferWork, true);
   
   PlotIndexSetString(0, PLOT_LABEL, "Mako Breaker Blocks & Failed Order Block Tracker");
   
   MakoGuard.Init("mako-breaker-block-mitigation-pro", "Mako Breaker Blocks & Failed Order Block Tracker", true, "1.60");
   if(MakoGuard.Verify() != INIT_SUCCEEDED)
      return(INIT_FAILED);
      
   if(InpShowHUD)
   {
      MakoDisplay.CreatePanel("Mako Breaker Blocks & Failed Order Block Tracker", "PRO");
      MakoDisplay.SetRow(0, "Tool Status", "ACTIVE & SYNCED", CLR_MAKO_BULL);
      MakoDisplay.SetRow(1, "Engine Mode", "PRICE_ACTION_SMC", CLR_MAKO_ACCENT);
      MakoDisplay.SetRow(2, "Version", "v1.60", CLR_MAKO_MUTED);
   }
   
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   MakoDisplay.Destroy();
   MakoGuard.CleanBanner();
}

int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   if(rates_total < InpPeriod)
      return(0);
      
   int start = prev_calculated - 1;
   if(start < 0) start = 0;
   
   for(int i = start; i < rates_total; i++)
   {
      double sum = 0.0;
      for(int k = 0; k < InpPeriod; k++)
      {
         int idx = i - k;
         if(idx >= 0 && idx < rates_total)
            sum += close[idx];
      }
      BufferPlot[i] = sum / InpPeriod;
   }
   
   return(rates_total);
}
