//+------------------------------------------------------------------+
//|                                                    TestProbe.mq5 |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property version   "1.00"

int OnInit()
{
   Print("Mako Test Probe initialized successfully.");
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason)
{
   Print("Mako Test Probe deinitialized.");
}

void OnTick()
{
}
