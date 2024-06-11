"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const verifyOptions = {
  algorithms: ["RS256"],
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    //verify
    JWT.verify(accessToken, publicKey, verifyOptions, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1- check userId missing ?
  2- get access token
  3- verify token
  4- check user in dbs?
  5- check keyStore with this userId
  6- ok all => next
   */

  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  //2
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    const decodeUser = JWT.verify(
      accessToken,
      keyStore.publicKey,
      verifyOptions
    );
    console.log(decodeUser);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userid");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});

module.exports = { createTokenPair, authentication };
