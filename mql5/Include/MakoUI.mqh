//+------------------------------------------------------------------+
//|                                                       MakoUI.mqh |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property strict

//--- Mako Brand Palette
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
   
public:
   CMakoUI(const string prefix, const int x = 15, const int y = 25, const int w = 240, const int h = 160)
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
      // Panel Base
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
      
      // Top Brand Stripe
      ObjectCreate(0, m_prefix + "Stripe", OBJ_RECTANGLE_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_XDISTANCE, m_base_x);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_YDISTANCE, m_base_y);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_XSIZE, m_width);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_YSIZE, 3);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_BGCOLOR, CLR_MAKO_PRIMARY);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_BORDER_TYPE, BORDER_FLAT);
      ObjectSetInteger(0, m_prefix + "Stripe", OBJPROP_COLOR, CLR_MAKO_PRIMARY);
      
      // Title Label
      ObjectCreate(0, m_prefix + "Title", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_XDISTANCE, m_base_x + 12);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_YDISTANCE, m_base_y + 10);
      ObjectSetString(0, m_prefix + "Title", OBJPROP_TEXT, "MAKO // " + title);
      ObjectSetString(0, m_prefix + "Title", OBJPROP_FONT, "Segoe UI Semibold");
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_FONTSIZE, 9);
      ObjectSetInteger(0, m_prefix + "Title", OBJPROP_COLOR, CLR_MAKO_TEXT);
      
      // Badge
      ObjectCreate(0, m_prefix + "Badge", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_XDISTANCE, m_base_x + m_width - 40);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_YDISTANCE, m_base_y + 10);
      ObjectSetString(0, m_prefix + "Badge", OBJPROP_TEXT, badge);
      ObjectSetString(0, m_prefix + "Badge", OBJPROP_FONT, "Segoe UI Bold");
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_FONTSIZE, 8);
      ObjectSetInteger(0, m_prefix + "Badge", OBJPROP_COLOR, (badge == "FREE" ? CLR_MAKO_BULL : CLR_MAKO_ACCENT));
   }
   
   void SetRow(const int rowIndex, const string label, const string val, const color valColor = CLR_MAKO_TEXT)
   {
      int rowY = m_base_y + 36 + (rowIndex * 20);
      string lblName = m_prefix + "RowLbl_" + IntegerToString(rowIndex);
      string valName = m_prefix + "RowVal_" + IntegerToString(rowIndex);
      
      // Label
      if(ObjectFind(0, lblName) < 0)
      {
         ObjectCreate(0, lblName, OBJ_LABEL, 0, 0, 0);
         ObjectSetInteger(0, lblName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
         ObjectSetInteger(0, lblName, OBJPROP_XDISTANCE, m_base_x + 12);
         ObjectSetInteger(0, lblName, OBJPROP_YDISTANCE, rowY);
         ObjectSetString(0, lblName, OBJPROP_FONT, "Segoe UI");
         ObjectSetInteger(0, lblName, OBJPROP_FONTSIZE, 8);
         ObjectSetInteger(0, lblName, OBJPROP_COLOR, CLR_MAKO_MUTED);
      }
      ObjectSetString(0, lblName, OBJPROP_TEXT, label);
      
      // Value
      if(ObjectFind(0, valName) < 0)
      {
         ObjectCreate(0, valName, OBJ_LABEL, 0, 0, 0);
         ObjectSetInteger(0, valName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
         ObjectSetInteger(0, valName, OBJPROP_XDISTANCE, m_base_x + m_width - 12);
         ObjectSetInteger(0, valName, OBJPROP_YDISTANCE, rowY);
         ObjectSetInteger(0, valName, OBJPROP_ANCHOR, ANCHOR_RIGHT_UPPER);
         ObjectSetString(0, valName, OBJPROP_FONT, "Consolas");
         ObjectSetInteger(0, valName, OBJPROP_FONTSIZE, 9);
      }
      ObjectSetString(0, valName, OBJPROP_TEXT, val);
      ObjectSetInteger(0, valName, OBJPROP_COLOR, valColor);
   }
   
   void Destroy()
   {
      ObjectsDeleteAll(0, m_prefix);
      ChartRedraw(0);
   }
};
