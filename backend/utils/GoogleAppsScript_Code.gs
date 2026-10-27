/**
 * ============================================================================
 * KALAM 2026 - MONGODB ATLAS DATABASE CONNECTOR SCRIPT FOR GOOGLE SHEETS
 * ============================================================================
 * 
 * INSTRUCTIONS:
 * 1. In your Google Sheet, click: Extensions > Apps Script
 * 2. Delete ALL existing code in the editor (Code.gs).
 * 3. Copy and paste ALL of this script into Code.gs.
 * 4. Click the blue 'Deploy' button (top right) > 'New deployment'.
 * 5. Click the Gear icon next to 'Select type' and choose 'Web app'.
 * 6. Set Description: "KALAM MongoDB Atlas Sync"
 * 7. Set 'Execute as': "Me"
 * 8. Set 'Who has access': "Anyone"
 * 9. Click 'Deploy', authorize if prompted, and COPY the Web App URL.
 * 10. Paste that URL into your Admin Portal at /admin/sheets and click 'Sync All Collections to Sheets'.
 */

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    // Wait up to 30 seconds for concurrent writes
    lock.waitLock(30000);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var contents = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var payload = {};
    
    try {
      payload = JSON.parse(contents);
    } catch(parseErr) {
      // In case data came as URL-encoded or parameter
      if (e && e.parameter && e.parameter.payload) {
        payload = JSON.parse(e.parameter.payload);
      } else {
        payload = {};
      }
    }
    
    // -------------------------------------------------------------
    // ACTION 1: HEALTH CHECK / TEST
    // -------------------------------------------------------------
    if (payload.action === 'test') {
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Google Sheets & MongoDB Atlas connection verified successfully!",
        spreadsheetTitle: ss.getName(),
        totalSheets: ss.getSheets().length,
        sheets: ss.getSheets().map(function(s) { return s.getName(); })
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------------------------------
    // ACTION 2: FULL DATABASE SYNC (ALL COLLECTIONS TO TABS)
    // -------------------------------------------------------------
    if (payload.action === 'sync_database' && payload.collections) {
      var syncedCollections = [];
      var collectionStats = [];
      var collectionsObj = payload.collections;
      
      var tabThemes = {
        "Events": { bg: "#1e1b4b", text: "#ffffff" },
        "Passes": { bg: "#581c87", text: "#ffffff" },
        "SiteConfig": { bg: "#14532d", text: "#ffffff" },
        "Departments": { bg: "#164e63", text: "#ffffff" },
        "CulturalSubcategories": { bg: "#831843", text: "#ffffff" },
        "Clubs": { bg: "#713f12", text: "#ffffff" },
        "PastEvents": { bg: "#1f2937", text: "#ffffff" },
        "Admins": { bg: "#312e81", text: "#ffffff" }
      };
      
      for (var colName in collectionsObj) {
        if (!collectionsObj.hasOwnProperty(colName)) continue;
        var colData = collectionsObj[colName];
        var headers = colData.headers || [];
        var rows = colData.rows || [];
        
        var sheet = ss.getSheetByName(colName);
        if (!sheet) {
          sheet = ss.insertSheet(colName);
        }
        
        // Clear old contents
        sheet.clear();
        
        if (headers.length > 0) {
          // Write headers
          sheet.appendRow(headers);
          var headerRange = sheet.getRange(1, 1, 1, headers.length);
          headerRange.setFontWeight("bold");
          var theme = tabThemes[colName] || { bg: "#0f172a", text: "#ffffff" };
          headerRange.setBackground(theme.bg);
          headerRange.setFontColor(theme.text);
          sheet.setFrozenRows(1);
          
          // Write data rows
          if (rows.length > 0) {
            sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
            sheet.getRange(2, 1, rows.length, headers.length).setFontFamily("Arial").setFontSize(10);
          }
          
          // Auto-fit column widths (min 100, max 350)
          for (var colIdx = 1; colIdx <= headers.length; colIdx++) {
            sheet.autoResizeColumn(colIdx);
            var colWidth = sheet.getColumnWidth(colIdx);
            if (colWidth > 350) {
              sheet.setColumnWidth(colIdx, 350);
            } else if (colWidth < 100) {
              sheet.setColumnWidth(colIdx, 100);
            }
          }
        }
        
        syncedCollections.push(colName);
        collectionStats.push({ name: colName, records: rows.length });
      }
      
      // Update Overview / Dashboard tab
      var overviewSheet = ss.getSheetByName("DB_Overview") || ss.insertSheet("DB_Overview", 0);
      overviewSheet.clear();
      
      overviewSheet.appendRow(["KALAM 2026 - MONGODB ATLAS DATABASE MIRROR"]);
      overviewSheet.getRange(1, 1, 1, 4).merge().setBackground("#D62C76").setFontColor("#ffffff").setFontWeight("bold").setFontSize(14);
      
      overviewSheet.appendRow(["Cluster:", "kalam.kz35dtp.mongodb.net", "Last Synced:", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })]);
      overviewSheet.appendRow(["Database:", payload.databaseName || "kalam", "Synced Tabs:", syncedCollections.length]);
      overviewSheet.appendRow([]);
      
      overviewSheet.appendRow(["Collection Tab", "Record Count", "Status", "Description"]);
      var subHeader = overviewSheet.getRange(5, 1, 1, 4);
      subHeader.setBackground("#1e293b").setFontColor("#ffffff").setFontWeight("bold");
      
      for (var sIdx = 0; sIdx < collectionStats.length; sIdx++) {
        var stat = collectionStats[sIdx];
        overviewSheet.appendRow([stat.name, stat.records, "Synced & Active", "MongoDB Atlas Live Collection"]);
      }
      
      overviewSheet.autoResizeColumns(1, 4);
      
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Successfully synchronized MongoDB Atlas database to Google Sheets!",
        database: payload.databaseName,
        syncedCollections: syncedCollections,
        totalCollections: syncedCollections.length
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------------------------------
    // ACTION 3: SINGLE COLLECTION SYNC
    // -------------------------------------------------------------
    if (payload.action === 'sync_collection' && payload.collection) {
      var sheetName = payload.collection;
      var headers = payload.headers || [];
      var rows = payload.rows || [];
      
      var targetSheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
      targetSheet.clear();
      
      if (headers.length > 0) {
        targetSheet.appendRow(headers);
        var hRange = targetSheet.getRange(1, 1, 1, headers.length);
        hRange.setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
        targetSheet.setFrozenRows(1);
        
        if (rows.length > 0) {
          targetSheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
        }
        for (var c = 1; c <= headers.length; c++) {
          targetSheet.autoResizeColumn(c);
        }
      }
      
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Synced collection " + sheetName + " (" + rows.length + " records)",
        collection: sheetName,
        rowCount: rows.length
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // -------------------------------------------------------------
    // ACTION 4: LOG INDIVIDUAL REGISTRATION (REAL-TIME REGISTRATION LOGGING)
    // -------------------------------------------------------------
    if (payload.action === 'log_registration') {
      var regSheet = ss.getSheetByName("Registrations");
      var regHeaders = [
        "Timestamp", "Ticket ID", "Student Name", "Email", "Phone",
        "College", "Department", "Roll Number", "Year", "District",
        "Pass Name", "Pass ID", "Events", "Amount", "Payment Status"
      ];
      
      if (!regSheet) {
        regSheet = ss.insertSheet("Registrations");
        regSheet.appendRow(regHeaders);
        var rHeaderRange = regSheet.getRange(1, 1, 1, regHeaders.length);
        rHeaderRange.setFontWeight("bold").setBackground("#047857").setFontColor("#ffffff");
        regSheet.setFrozenRows(1);
      }
      
      var eventsStr = Array.isArray(payload.events) ? payload.events.join(", ") : (payload.events || "");
      var regRow = [
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        payload.ticketId || "",
        payload.studentName || "",
        payload.email || "",
        payload.phone || "",
        payload.college || "",
        payload.department || "",
        payload.rollNumber || "",
        payload.year || "",
        payload.district || "",
        payload.passName || "",
        payload.passId || "",
        eventsStr,
        payload.amount || 0,
        payload.paymentStatus || "completed"
      ];
      
      regSheet.appendRow(regRow);
      
      lock.releaseLock();
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Registration logged successfully for " + (payload.studentName || payload.email),
        ticketId: payload.ticketId
      })).setMimeType(ContentService.MimeType.JSON);
    }

    lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Unknown or invalid action: " + (payload.action || "none")
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "KALAM 2026 - MongoDB Atlas Google Sheets Connector",
    cluster: "kalam.kz35dtp.mongodb.net",
    time: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Safety guard: if copied into Google Apps Script, 'module' is undefined so this does nothing.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { doPost, doGet };
}
