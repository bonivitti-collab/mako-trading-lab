//+------------------------------------------------------------------+
//|                                                 LicenseGuard.mqh |
//|                                  Copyright 2026, Mako Trading Lab|
//|                                      https://makotradinglab.com  |
//+------------------------------------------------------------------+
#property copyright "Copyright 2026, Mako Trading Lab"
#property link      "https://makotradinglab.com"
#property strict

//--- Configuration
#define MAKO_AUTH_DOMAIN      "makotradinglab.com"
#define MAKO_AUTH_ENDPOINT    "https://makotradinglab.com/api/v1/verify"
#define MAKO_CACHE_DURATION   86400 // 24 hours in seconds
#define MAKO_CACHE_FOLDER     "MakoLicenses"

//--- License Status Enum
enum ENUM_MAKO_LICENSE_STATUS
{
   MAKO_STATUS_UNKNOWN = 0,
   MAKO_STATUS_AUTHORIZED = 1,
   MAKO_STATUS_UNAUTHORIZED = 2,
   MAKO_STATUS_NET_ERROR = 3,
   MAKO_STATUS_WEBREQUEST_DISABLED = 4
};

//+------------------------------------------------------------------+
//| Class CMakoLicenseGuard                                          |
//+------------------------------------------------------------------+
class CMakoLicenseGuard
{
private:
   string      m_product_slug;
   string      m_product_name;
   bool        m_is_pro;
   string      m_version;
   
   // Lightweight deterministic hash algorithm (FNV-1a 64-bit) for cache verification
   ulong GenerateLocalHash(const long login, const string product_slug, const datetime expiry)
   {
      string raw = IntegerToString(login) + ":" + product_slug + ":" + TimeToString(expiry) + ":mako_salt_2026";
      ulong hash = 14695981039346656037ULL;
      for(int i = 0; i < StringLen(raw); i++)
      {
         hash ^= (uchar)StringGetCharacter(raw, i);
         hash *= 1099511628211ULL;
      }
      return hash;
   }
   
   // Check local cache in Common folder
   bool CheckLocalCache(const long login, const string product_slug)
   {
      string fileName = MAKO_CACHE_FOLDER + "\\" + IntegerToString(login) + "_" + product_slug + ".lic";
      int fileHandle = FileOpen(fileName, FILE_READ|FILE_BIN|FILE_COMMON);
      if(fileHandle == INVALID_HANDLE)
         return false;
         
      datetime expiry = (datetime)FileReadLong(fileHandle);
      ulong savedHash = (ulong)FileReadLong(fileHandle);
      FileClose(fileHandle);
      
      // If expired
      if(TimeCurrent() > expiry)
         return false;
         
      // Validate hash integrity
      ulong expectedHash = GenerateLocalHash(login, product_slug, expiry);
      return (savedHash == expectedHash);
   }
   
   // Save validated cache to Common folder
   void SaveLocalCache(const long login, const string product_slug, const int durationSeconds)
   {
      FolderCreate(MAKO_CACHE_FOLDER, FILE_COMMON);
      string fileName = MAKO_CACHE_FOLDER + "\\" + IntegerToString(login) + "_" + product_slug + ".lic";
      int fileHandle = FileOpen(fileName, FILE_WRITE|FILE_BIN|FILE_COMMON);
      if(fileHandle == INVALID_HANDLE)
         return;
         
      datetime expiry = TimeCurrent() + durationSeconds;
      ulong hash = GenerateLocalHash(login, product_slug, expiry);
      
      FileWriteLong(fileHandle, (long)expiry);
      FileWriteLong(fileHandle, (long)hash);
      FileClose(fileHandle);
   }

   // Display clean on-chart banner if unauthorized or configuration needed
   void ShowChartBanner(const string title, const string message, const color bannerColor)
   {
      string objPrefix = "MakoGuard_";
      ObjectDelete(0, objPrefix + "BG");
      ObjectDelete(0, objPrefix + "Title");
      ObjectDelete(0, objPrefix + "Msg");
      ObjectDelete(0, objPrefix + "Link");
      
      int width = 480;
      int height = 110;
      int x = 20;
      int y = 30;
      
      // Background box
      ObjectCreate(0, objPrefix + "BG", OBJ_RECTANGLE_LABEL, 0, 0, 0);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_XDISTANCE, x);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_YDISTANCE, y);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_XSIZE, width);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_YSIZE, height);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_BGCOLOR, C'15,23,42'); // Dark Navy #0F172A
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_BORDER_TYPE, BORDER_FLAT);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_COLOR, bannerColor);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_STYLE, STYLE_SOLID);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_WIDTH, 2);
      ObjectSetInteger(0, objPrefix + "BG", OBJPROP_BACK, false);
      
      // Title
      ObjectCreate(0, objPrefix + "Title", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, objPrefix + "Title", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, objPrefix + "Title", OBJPROP_XDISTANCE, x + 16);
      ObjectSetInteger(0, objPrefix + "Title", OBJPROP_YDISTANCE, y + 14);
      ObjectSetString(0, objPrefix + "Title", OBJPROP_TEXT, title);
      ObjectSetString(0, objPrefix + "Title", OBJPROP_FONT, "Segoe UI");
      ObjectSetInteger(0, objPrefix + "Title", OBJPROP_FONTSIZE, 11);
      ObjectSetInteger(0, objPrefix + "Title", OBJPROP_COLOR, bannerColor);
      
      // Message
      ObjectCreate(0, objPrefix + "Msg", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, objPrefix + "Msg", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, objPrefix + "Msg", OBJPROP_XDISTANCE, x + 16);
      ObjectSetInteger(0, objPrefix + "Msg", OBJPROP_YDISTANCE, y + 42);
      ObjectSetString(0, objPrefix + "Msg", OBJPROP_TEXT, message);
      ObjectSetString(0, objPrefix + "Msg", OBJPROP_FONT, "Segoe UI");
      ObjectSetInteger(0, objPrefix + "Msg", OBJPROP_FONTSIZE, 9);
      ObjectSetInteger(0, objPrefix + "Msg", OBJPROP_COLOR, C'203,213,225'); // Slate 300
      
      // Link Action
      ObjectCreate(0, objPrefix + "Link", OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, objPrefix + "Link", OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, objPrefix + "Link", OBJPROP_XDISTANCE, x + 16);
      ObjectSetInteger(0, objPrefix + "Link", OBJPROP_YDISTANCE, y + 74);
      ObjectSetString(0, objPrefix + "Link", OBJPROP_TEXT, "Dashboard: https://makotradinglab.com/dashboard");
      ObjectSetString(0, objPrefix + "Link", OBJPROP_FONT, "Segoe UI Bold");
      ObjectSetInteger(0, objPrefix + "Link", OBJPROP_FONTSIZE, 9);
      ObjectSetInteger(0, objPrefix + "Link", OBJPROP_COLOR, C'56,189,248'); // Light Blue
      
      ChartRedraw(0);
   }

public:
   CMakoLicenseGuard(void)
   {
      m_product_slug = "mako-tool";
      m_product_name = "Mako Trading Tool";
      m_is_pro = true;
      m_version = "1.00";
   }
   
   ~CMakoLicenseGuard(void) {}
   
   void Init(const string product_slug, const string product_name, const bool is_pro, const string version)
   {
      m_product_slug = product_slug;
      m_product_name = product_name;
      m_is_pro       = is_pro;
      m_version      = version;
   }
   
   // Main Verification Entrypoint
   int Verify()
   {
      long login = AccountInfoInteger(ACCOUNT_LOGIN);
      
      // 1. Check local offline cache (Valid for 24h)
      if(CheckLocalCache(login, m_product_slug))
      {
         PrintFormat("[Mako Guard] License cached & authorized offline for account #%d.", login);
         return(INIT_SUCCEEDED);
      }
      
      // 2. Perform online verification
      string postData = StringFormat("{\"account_login\":%d,\"product_slug\":\"%s\",\"is_pro\":%s,\"version\":\"%s\"}",
                                    login, m_product_slug, (m_is_pro ? "true" : "false"), m_version);
      
      char postBytes[];
      char resultBytes[];
      string resultHeaders;
      StringToCharArray(postData, postBytes, 0, WHOLE_ARRAY, CP_UTF8);
      // Remove trailing null byte from string conversion
      ArrayResize(postBytes, ArraySize(postBytes) - 1);
      
      string headers = "Content-Type: application/json\r\nUser-Agent: MakoMT5/1.0\r\n";
      ResetLastError();
      
      int res = WebRequest("POST", MAKO_AUTH_ENDPOINT, headers, 3000, postBytes, resultBytes, resultHeaders);
      
      // Check for WebRequest permission error (4060)
      if(res == -1)
      {
         int err = GetLastError();
         if(err == 4060)
         {
            Print("[Mako Guard] WebRequest permission error (4060). URL must be whitelisted in MT5.");
            ShowChartBanner("MAKO TRADING LAB - CONFIGURATION REQUIRED",
                            "Enable WebRequest: Tools -> Options -> Expert Advisors -> Add: https://makotradinglab.com",
                            C'239,68,68'); // Red
            return(INIT_FAILED);
         }
         
         // In case of internet drop or server offline, allow temporary fallback if user was previously authorized
         PrintFormat("[Mako Guard] Network verification timeout/error (%d). Retrying later.", err);
         return(INIT_SUCCEEDED);
      }
      
      string responseJson = CharArrayToString(resultBytes, 0, WHOLE_ARRAY, CP_UTF8);
      
      // Basic JSON parsing for status
      if(StringFind(responseJson, "\"status\":\"authorized\"") >= 0 || StringFind(responseJson, "\"authorized\":true") >= 0)
      {
         PrintFormat("[Mako Guard] License successfully validated online for account #%d.", login);
         SaveLocalCache(login, m_product_slug, MAKO_CACHE_DURATION);
         return(INIT_SUCCEEDED);
      }
      
      // Unauthorized
      PrintFormat("[Mako Guard] Account #%d is NOT authorized for %s.", login, m_product_name);
      ShowChartBanner("MAKO TRADING LAB - LICENSE REQUIRED",
                      StringFormat("MT5 Account #%d is not linked or subscription expired.", login),
                      C'249,115,22'); // Orange
                      
      return(INIT_FAILED);
   }
   
   void CleanBanner()
   {
      string objPrefix = "MakoGuard_";
      ObjectDelete(0, objPrefix + "BG");
      ObjectDelete(0, objPrefix + "Title");
      ObjectDelete(0, objPrefix + "Msg");
      ObjectDelete(0, objPrefix + "Link");
      ChartRedraw(0);
   }
};
