import { d as defineEventHandler, r as readBody, g as getRequestHeaders } from './nitro/node-server.mjs';
import { c as checkRoute } from './checkRoute.mjs';
import { i as initAdminService } from './initAdminService.mjs';
import formidable from 'formidable';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '@prisma/client';
import 'jsonwebtoken';
import 'ms';
import 'nodemailer';
import 'ipx';
import './protectRoute.mjs';
import './initiative.repository.mjs';

const ____category__post = defineEventHandler(
  async (event) => {
    var _a, _b;
    checkRoute(event);
    const adminService = initAdminService(event);
    switch ((_a = event.context.params) == null ? void 0 : _a.category) {
      case "user": {
        const user = await readBody(event);
        return await adminService.userSave(user);
      }
      case "region": {
        const region = await readBody(event);
        return await adminService.regionSave(region);
      }
      case "ownership": {
        const ownership = await readBody(event);
        return await adminService.ownershipSave(ownership);
      }
      case "types": {
        const type = await readBody(event);
        return await adminService.initiativeTypesSave(type);
      }
      case "news": {
        const news = await readBody(event);
        return await adminService.newsSave(news);
      }
      case "company": {
        const company = await readBody(event);
        return await adminService.companySave(company);
      }
      case "initiative": {
        const headers = getRequestHeaders(event);
        let item;
        if ((_b = headers["content-type"]) == null ? void 0 : _b.includes("multipart/form-data")) {
          item = await parseMultipartNodeRequest(event.node.req);
        } else {
          item = await readBody(event);
        }
        return await adminService.initiativeSave(item);
      }
      case "moderate_company": {
        const data = await readBody(event);
        console.log(data);
        if (!(data == null ? void 0 : data.id))
          return;
        return await adminService.companyModeration(
          data.id,
          data.approved ? "approved" : "declined",
          data == null ? void 0 : data.reason
        );
      }
      case "moderate_initiative": {
        const data = await readBody(event);
        if (!(data == null ? void 0 : data.id))
          return;
        return await adminService.initiativeModeration(
          data.id,
          data.approved ? "approved" : "declined",
          data == null ? void 0 : data.reason
        );
      }
    }
    return "";
  }
);
function parseMultipartNodeRequest(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      uploadDir: "./public/upload",
      keepExtensions: true,
      minFileSize: 30 * 1024,
      maxFileSize: 3 * 1024 * 1024,
      filter(file) {
        var _a;
        const originalFilename = (_a = file.originalFilename) != null ? _a : "";
        const allowedExtensions = /\.(jpe?g|png|gif|webp|svg)$/i;
        if (!allowedExtensions.test(originalFilename)) {
          return false;
        }
        return true;
      }
    });
    form.parse(req, (error, fields, files) => {
      var _a;
      if (error) {
        reject(error);
        return;
      }
      let photos = [];
      if (Array.isArray(files.photos)) {
        files.photos.forEach((file) => {
          photos.push({
            path: `/upload/${file.newFilename}`
          });
        });
      }
      let result = [];
      for (let key in fields) {
        const value = ((_a = fields[key]) == null ? void 0 : _a[0]) || "";
        if (key === "photosList") {
          let photosList = [];
          try {
            photosList = typeof value === "string" ? JSON.parse(value) : [];
          } catch (e) {
          }
          photos = [...photos, ...photosList];
        } else {
          result[key] = value;
        }
      }
      result["photos"] = photos;
      resolve(result);
    });
  });
}

export { ____category__post as default };
