async function logout(req, res, next) {
  const { refreshToken: refreshTokenValue } = req.body;

  if (!refreshTokenValue) {
    return res.status(400).json({
      success: false,
      message: "Provide a refresh token",
    });
  }

  try {
    // Verify refresh token signature
    let decodedRefresh;
    try {
      decodedRefresh = jwt.verify(refreshTokenValue, process.env.SECRET_KEY);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    // Find refresh token in database
    const refreshTokenRecord = await RefreshToken.findOne({
      where: { token: refreshTokenValue },
    });

    if (!refreshTokenRecord) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found",
      });
    }

    // Extract and verify access token
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Provide an access token",
      });
    }

    let decodedAccess;
    try {
      decodedAccess = jwt.verify(accessToken, process.env.SECRET_KEY, {
        ignoreExpiration: true, // allow expired tokens to be logged out
      });
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    // Ensure both tokens belong to the same user
    if (decodedAccess.id !== refreshTokenRecord.userId) {
      return res.status(403).json({
        success: false,
        message: "Token mismatch – logout denied",
      });
    }

    // Compute expiration to store
    const expiresAt = new Date(decodedAccess.exp * 1000);

    // Delete refresh token
    await refreshTokenRecord.destroy();

    // Store revoked access token
    await RevokedToken.create({
      token: accessToken,
      expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
