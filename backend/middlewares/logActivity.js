const { logActivity } = require("../services/logService");
const { getClientIp, getClientBrowser } = require("../utils/requestUtils");

/**
 * Middleware untuk mencatat aktivitas pengguna (Create, Update, Delete).
 * @param {string} action - Deskripsi aksi yang dilakukan.
 */
const logActivityMiddleware = (action) => (req, res, next) => {
  const oldSend = res.send;
  res.send = function (body) {
    // Hanya log jika request berhasil (status 2xx) dan bukan metode GET
    if (
      res.statusCode >= 200 &&
      res.statusCode < 300 &&
      req.method !== "GET"
    ) {
      let targetId = null;

      // Dapatkan ID dari params untuk PUT/DELETE
      if (req.params.id) {
        targetId = req.params.id;
      }

      // Dapatkan ID dari body response untuk POST (jika controller mengembalikannya)
      if (req.method === "POST" && body) {
        try {
          const responseBody = JSON.parse(body);
          targetId = responseBody.id || responseBody.data?.id || null;
        } catch (e) {
          // Abaikan jika body bukan JSON
        }
      }

      logActivity({
        user: req.user?.name || "Unknown User",
        ip: getClientIp(req),
        browser: getClientBrowser(req.headers["user-agent"]),
        action: `${req.method} ${action}`,
        target: targetId,
      });
    }
    oldSend.apply(res, arguments);
  };
  next();
};

module.exports = logActivityMiddleware;
