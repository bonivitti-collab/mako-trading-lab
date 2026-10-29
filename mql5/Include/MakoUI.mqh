//+------------------------------------------------------------------+
//|                                                       MakoUI.mqh |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property strict

//--- Mako Institutional High-Contrast Dark Palette
#define CLR_MAKO_BG         C'11,15,25'     // Deep Navy #0B0F19
#define CLR_MAKO_SURFACE    C'20,27,45'     // Surface #141B2D
#define CLR_MAKO_BORDER     C'30,41,69'     // Border #1E2945
#define CLR_MAKO_PRIMARY    C'0,102,255'    // Electric Blue #0066FF
#define CLR_MAKO_ACCENT     C'0,210,255'    // Cyan Accent #00D2FF
#define CLR_MAKO_TEXT       C'241,245,249'  // Slate 100
#define CLR_MAKO_MUTED      C'148,163,184'  // Slate 400
#define CLR_MAKO_BULL       C'16,185,129'   // Emerald 500
#define CLR_MAKO_BEAR       C'239,68,68'    // Rose 500

class CMakoUI
{
private:
   string m_prefix;
   int    m_base_x;
   int    m_base_y;
   int    m_width;
   int    m_height;
   
   // Clean truncation helper to ensure titles never overlap badges
   string FormatTitle(const string fullTitle, const int maxLen = 22)
   {
      string t = fullTitle;
      StringReplace(t, "Mako ", "");
      if(StringLen(t) > maxLen)
         return StringSubstr(t, 0, maxLen - 2) + "..";
      return t;
   }
   
public:
   // Default layout: x=15, y=65 (safe under MT5 native OHLC info bar), width=290, height=140
   CMakoUI(const string prefix, const int x = 15, const int y = 65, const int w = 290, const int h = 140)
   {
      m_prefix = prefix + "_";
      m_base_x = x;
      m_base_y = y;
      m_width  = w;
      m_height = h;
   }
   
   ~CMakoUI()
   {
      Destroy();
   }
   
   void CreatePanel(const string title, const string badge = "PRO")
   {
      // 1. Panel Base Card (Opaque high-contrast canvas)
      ObjectCreate(0, m_prefix + "Card", OBJ_RECTANGLE_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_XDISTANCE, m_base_x);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_YDISTANCE, m_base_y);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_XSIZE, m_width);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_YSIZE, m_height);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_BGCOLOR, CLR_MAKO_BG);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_BORDER_TYPE, BORDER_FLAT);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_COLOR, CLR_MAKO_BORDER);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_WIDTH, 1);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_BACK, false);
      ObjectSetInteger(0, m_prefix + "Card", OBJPROP_SELECTABLE, false);
      
      // 2. Top Institutional Brand Stripe
      ObjectCreate(0, m_prefix + "Stripe", OBJ_RECTANGLE_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_XDISTANCE, m_base_x);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_YDISTANCE, m_base_y);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_XSIZE, m_width);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_YSIZE, 3);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_BGCOLOR, CLR_MAKO_PRIMARY);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_BORDER_TYPE, BORDER_FLAT);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_COLOR, CLR_MAKO_PRIMARY);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_BACK, false);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_SELECTABLE, false);
      
      // 3. Brand / Tool Title Label (Left anchored)
      ObjectCreate(0, m_prefix + "Title", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_XDISTANCE, m_base_x + 12);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_YDISTANCE, m_base_y + 10);
      ObjectSetString(0, m_prefix + "Title", OBJPROP_TEXT, "MAKO // " + FormatTitle(title, 20));
      ObjectSetString(0, m_prefix + "Title", OBJPROP_FONT, "Segoe UI");
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_FONTSIZE, 9);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_COLOR, CLR_MAKO_TEXT);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_BACK, false);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_SELECTABLE, false);
      
      // 4. Tier Badge (Right anchored with dedicated space)
      ObjectCreate(0, m_prefix + "Badge", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_ANCHOR, ANCHOR_RIGHT_UPPER);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_XDISTANCE, m_base_x + m_width - 12);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_YDISTANCE, m_base_y + 10);
      ObjectSetString(0, m_prefix + "Badge", OBJPROP_TEXT, badge);
      ObjectSetString(0, m_prefix + "Badge", OBJPROP_FONT, "Segoe UI Bold");
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_FONTSIZE, 8);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_COLOR, (badge == "FREE" ? CLR_MAKO_BULL : CLR_MAKO_ACCENT));
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_BACK, false);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_SELECTABLE, false);

      // Force immediate visual render on chart
      ChartRedraw(0);
   }
   
   void SetRow(const int rowIndex, const string label, const string val, const color valColor = CLR_MAKO_TEXT)
   {
      int rowY = m_base_y + 36 + (rowIndex * 22);
      string lblName = m_prefix + "RowLbl_" + IntegerToString(rowIndex);
      string valName = m_prefix + "RowVal_" + IntegerToString(rowIndex);
      
      // Row Label (Left)
      if(ObjectFind(0, lblName) < 0)
      {
         ObjectCreate(0, lblName, OBJ_LABEL, 0, 0, 0);
         ObjectSetInteger(0, lblName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
         ObjectSetInteger(0, lblName, OBJPROP_XDISTANCE, m_base_x + 12);
         ObjectSetInteger(0, lblName, OBJPROP_YDISTANCE, rowY);
         ObjectSetString(0, lblName, OBJPROP_FONT, "Segoe UI");
         ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, 8);
         ObjectSetInteger(0, lblName, OBJPROP_COLOR, CLR_MAKO_MUTED);
         ObjectSetInteger(0, lblName, OBJPROP_BACK, false);
         ObjectSetInteger(0, lblName, OBJPROP_SELECTABLE, false);
      }
      ObjectSetString(0, lblName, OBJPROP_TEXT, label);
      
      // Row Value (Right Anchored)
      if(ObjectFind(0, valName) < 0)
      {
         ObjectCreate(0, valName, OBJ_LABEL, 0, 0, 0);
         ObjectSetInteger(0, valName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
         ObjectSetInteger(0, valName, OBJPROP_ANCHOR, ANCHOR_RIGHT_UPPER);
         ObjectSetInteger(0, valName, OBJPROP_XDISTANCE, m_base_x + m_width - 12);
         ObjectSetInteger(0, valName, OBJPROP_YDISTANCE, rowY);
         ObjectSetString(0, valName, OBJPROP_FONT, "Consolas");
         ObjectSetInteger(0, valName, OBJPROP_FONTSIZE, 9);
         ObjectSetInteger(0, valName, OBJPROP_BACK, false);
         ObjectSetInteger(0, valName, OBJPROP_SELECTABLE, false);
      }
      ObjectSetString(0, valName, OBJPROP_TEXT, val);
      ObjectSetInteger(0, valName, OBJPROP_COLOR, valColor);
      
      ChartRedraw(0);
   }
   
   void Destroy()
   {
      ObjectsDeleteAll(0, m_prefix);
      ChartRedraw(0);
   }
};
