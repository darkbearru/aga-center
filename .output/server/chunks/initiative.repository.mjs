import { p as prismaClient } from './nitro/node-server.mjs';

class NewsRepository {
  async check(news) {
    const idQuery = typeof news.id !== "undefined" ? { id: { not: news.id } } : {};
    const res = await prismaClient.news.findFirst({
      where: {
        AND: [
          { title: news.title },
          idQuery
        ]
      }
    });
    return !res;
  }
  async count() {
    return prismaClient.news.count({});
  }
  async delete(news) {
    let result = true;
    try {
      await prismaClient.news.delete({
        where: { id: news.id }
      });
    } catch (e) {
      result = false;
    }
    return result;
  }
  async list(skip = 0, take = 20) {
    try {
      return await prismaClient.news.findMany({
        where: { active: true },
        skip,
        take,
        orderBy: {
          createdAt: "desc"
        }
      });
    } catch (e) {
      return void 0;
    }
  }
  async add(news) {
    const items = this.makePhotosLink(news.photos);
    try {
      return await prismaClient.news.create({
        data: {
          title: news.title,
          slug: news.slug,
          text: news.text,
          active: news.active,
          Photos: {
            connectOrCreate: items
          }
        }
      });
    } catch (e) {
      return false;
    }
  }
  async save(news) {
    const items = this.makePhotosLink(news.photos, news.id);
    try {
      await prismaClient.news.update({
        where: { id: news.id },
        data: {
          title: news.title,
          slug: news.slug,
          text: news.text,
          active: news.active,
          Photos: {
            connectOrCreate: items
          }
        }
      });
    } catch (e) {
      return false;
    }
    return true;
  }
  makePhotosLink(photos, id) {
    const items = [];
    if (photos) {
      photos.forEach((item) => {
        items.push({
          create: {
            path: item.path,
            title: item.title || ""
          },
          where: { id }
        });
      });
    }
    return items;
  }
}

class RegionsRepository {
  async add(region) {
    return prismaClient.regions.create({
      data: {
        name: region.name,
        slug: region.slug,
        isActive: region.isActive
      }
    });
  }
  async delete(region) {
    try {
      await prismaClient.regions.delete({
        where: {
          id: region.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async list() {
    try {
      return await prismaClient.regions.findMany({
        orderBy: [
          { isActive: "desc" },
          { name: "asc" }
        ]
      });
    } catch (e) {
      return void 0;
    }
  }
  async save(region) {
    try {
      await prismaClient.regions.update({
        data: {
          name: region.name,
          slug: region.slug,
          isActive: region.isActive
        },
        where: {
          id: region.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async checkSlug(region) {
    const idQuery = typeof region.id !== "undefined" ? { id: { not: region.id } } : {};
    const res = await prismaClient.regions.findFirst({
      where: {
        AND: [
          { slug: region.slug },
          idQuery
        ]
      }
    });
    return !res;
  }
}

class InitiativeTypesRepository {
  async add(type) {
    return prismaClient.initiativeTypes.create({
      data: {
        name: type.name
      }
    });
  }
  async check(type) {
    const idQuery = typeof type.id !== "undefined" ? { id: { not: type.id } } : {};
    const res = await prismaClient.initiativeTypes.findFirst({
      where: {
        AND: [
          { name: type.name },
          idQuery
        ]
      }
    });
    return !res;
  }
  async delete(type) {
    try {
      await prismaClient.initiativeTypes.delete({
        where: {
          id: type.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async list() {
    try {
      return await prismaClient.initiativeTypes.findMany({
        orderBy: { name: "asc" }
      });
    } catch (e) {
      return void 0;
    }
  }
  async save(type) {
    try {
      await prismaClient.initiativeTypes.update({
        data: {
          name: type.name
        },
        where: {
          id: type.id
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

var OrderStatus = /* @__PURE__ */ ((OrderStatus2) => {
  OrderStatus2[OrderStatus2["request"] = 1] = "request";
  OrderStatus2[OrderStatus2["active"] = 2] = "active";
  OrderStatus2[OrderStatus2["complete"] = 3] = "complete";
  OrderStatus2[OrderStatus2["deleted"] = 4] = "deleted";
  return OrderStatus2;
})(OrderStatus || {});

const selectFields = {
  id: true,
  status: true,
  direction: true,
  name: true,
  text: true,
  isApproved: true,
  isDeclined: true,
  declineReason: true,
  InitiativeTypes: {
    select: {
      id: true,
      name: true
    }
  },
  Regions: {
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true
    }
  },
  Company: {
    select: {
      id: true,
      nameShort: true,
      nameFull: true
    }
  },
  Photos: {
    select: {
      id: true,
      path: true
    }
  },
  _count: {
    select: {
      Order: true
    }
  }
};
const clientInitiativeFields = {
  id: true,
  name: true,
  text: true,
  Photos: {
    select: {
      id: true,
      path: true
    }
  },
  Reviews: {
    select: {
      id: true,
      title: true,
      review: true,
      rate: true,
      createdAt: true
    }
  },
  Company: {
    select: {
      id: true,
      nameShort: true,
      nameFull: true,
      typeOwnership: true
    }
  }
};
class InitiativeRepository {
  async add(item) {
    const photos = this.photosConnectOrCreate(item == null ? void 0 : item.photos);
    const created = await prismaClient.initiative.create({
      data: {
        status: true,
        direction: Number(item.direction),
        name: item.name,
        text: item.text,
        isApproved: false,
        isDeleted: false,
        isDeclined: false,
        declineReason: "",
        InitiativeTypes: {
          connect: {
            id: Number(item.type)
          }
        },
        Company: {
          connect: {
            id: Number(item.company)
          }
        },
        Regions: {
          connect: {
            id: Number(item.region)
          }
        },
        Photos: {
          connectOrCreate: photos
        }
      }
    });
    return await this.select(created.id);
  }
  photosConnectOrCreate(photos) {
    const result = [];
    photos == null ? void 0 : photos.forEach((item) => {
      result.push({
        where: { id: item.id || 0 },
        create: {
          path: item.path,
          title: item.title || ""
        }
      });
    });
    return result;
  }
  async select(id) {
    const result = await prismaClient.initiative.findFirst({
      where: { id },
      select: selectFields
    });
    return this.formatResult(result);
  }
  async check(item) {
    const idQuery = typeof item.id !== "undefined" ? { id: { not: Number(item.id) } } : {};
    const res = await prismaClient.initiative.findFirst({
      where: {
        AND: [
          { name: item.name },
          { isDeleted: Boolean(false) },
          { regionsId: Number(item.region) || 0 },
          idQuery
        ]
      },
      select: selectFields
    });
    return res ? this.formatResult(res) : void 0;
  }
  async delete(item, user) {
    try {
      const activeCount = await prismaClient.order.count({
        where: {
          initiativeId: item.id,
          status: OrderStatus.active
        }
      });
      if (activeCount > 0)
        return activeCount;
      await prismaClient.initiative.update({
        data: {
          isDeleted: true
        },
        where: {
          id: item.id,
          Company: {
            usersId: user.id
          }
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async list(user) {
    try {
      const result = await prismaClient.initiative.findMany({
        where: {
          isDeleted: false,
          Company: {
            usersId: user.id
          }
        },
        select: selectFields
      });
      return result.map((item) => this.formatResult(item));
    } catch (e) {
      return [];
    }
  }
  formatResult(item) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return {
      id: (item == null ? void 0 : item.id) || 0,
      status: (item == null ? void 0 : item.status) || false,
      direction: item.direction,
      isApproved: item.isApproved,
      isDeclined: item.isDeclined || false,
      declineReason: item.declineReason || "",
      name: item.name || "",
      text: item.text || "",
      type: {
        id: ((_a = item.InitiativeTypes) == null ? void 0 : _a.id) || 0,
        name: ((_b = item.InitiativeTypes) == null ? void 0 : _b.name) || ""
      },
      region: {
        id: (_c = item.Regions) == null ? void 0 : _c.id,
        name: ((_d = item.Regions) == null ? void 0 : _d.name) || "",
        slug: ((_e = item.Regions) == null ? void 0 : _e.slug) || "",
        isActive: ((_f = item.Regions) == null ? void 0 : _f.isActive) || false
      },
      company: {
        id: ((_g = item.Company) == null ? void 0 : _g.id) || 0,
        nameShort: ((_h = item.Company) == null ? void 0 : _h.nameShort) || "",
        nameFull: ((_i = item.Company) == null ? void 0 : _i.nameFull) || ""
      },
      photos: item.Photos || [],
      ordersCount: ((_j = item._count) == null ? void 0 : _j.Order) || 0
    };
  }
  async save(item, user) {
    try {
      const photos = this.photosConnectOrCreate(item == null ? void 0 : item.photos);
      await prismaClient.initiative.update({
        data: {
          status: item.status === "true",
          direction: Number(item.direction),
          isApproved: false,
          isDeclined: false,
          declineReason: "",
          name: item.name,
          text: item.text,
          initiativeTypesId: Number(item.type),
          companyId: Number(item.company),
          regionsId: Number(item.region),
          Photos: {
            connectOrCreate: photos
          }
        },
        where: {
          id: Number(item.id),
          Company: {
            Users: {
              id: user.id
            }
          }
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async deletePhotos(photos) {
    if (!photos.length)
      return;
    const idList = [];
    let where;
    if (photos.length > 1) {
      photos.forEach((item) => {
        if (item.id)
          idList.push(item.id);
      });
      if (idList.length === 0)
        return;
      const OR = idList.map((id) => {
        return { id };
      });
      where = { OR };
      console.log("deletePhotos", OR);
    } else {
      where = { id: photos[0].id };
    }
    console.log("deletePhotos", where);
    try {
      await prismaClient.photos.deleteMany({ where });
    } catch (e) {
      console.log(e);
    }
  }
  async selectDeleted(time) {
    console.log({
      where: {
        isDeleted: true,
        changedAt: {
          gte: time
        }
      },
      select: {
        id: true,
        Photos: {
          select: {
            id: true,
            path: true
          }
        }
      }
    });
    try {
      const result = await prismaClient.initiative.findMany({
        where: {
          isDeleted: true,
          changedAt: {
            gte: time
          }
        },
        select: {
          id: true,
          Photos: {
            select: {
              id: true,
              path: true
            }
          }
        }
      });
      return result.map((item) => this.formatResult(item));
    } catch (e) {
      return [];
    }
  }
  async deleteMany(idList) {
    let where;
    if (idList.length > 1) {
      const OR = idList.map((id) => {
        return { id };
      });
      where = { OR };
      console.log("deleteMany 1", OR);
    } else {
      where = { id: idList[0] };
    }
    console.log("deleteMany 2");
    console.log({ where });
    return;
  }
  async listByText(text, direction = 0) {
    try {
      return await prismaClient.initiative.findMany({
        select: clientInitiativeFields,
        where: {
          status: true,
          isApproved: true,
          isDeleted: false,
          direction,
          OR: [
            {
              name: {
                contains: text
              }
            },
            {
              text: {
                contains: text
              }
            }
          ]
        },
        orderBy: { createdAt: "desc" }
      });
    } catch (e) {
      return Promise.resolve({
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u043F\u043E \u0442\u0435\u043A\u0441\u0442\u0443 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F"
      });
    }
  }
  async listByType(typeId) {
    try {
      return await prismaClient.initiative.findMany({
        select: clientInitiativeFields,
        where: {
          status: true,
          isApproved: true,
          isDeleted: false,
          initiativeTypesId: Number(typeId)
        },
        orderBy: { createdAt: "desc" }
      });
    } catch (e) {
      console.log(e);
      return Promise.resolve({
        message: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u0438\u0432 \u043F\u043E \u0442\u0438\u043F\u0443"
      });
    }
  }
  async moderationList() {
    const result = await prismaClient.initiative.findMany({
      where: {
        isApproved: false,
        isDeleted: false,
        isDeclined: false
      },
      select: selectFields
    });
    return result.map((item) => this.formatResult(item));
  }
  async moderationApprove(id) {
    try {
      await prismaClient.initiative.update({
        where: { id },
        data: {
          isApproved: true,
          isDeclined: false,
          declineReason: ""
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
  async moderationDecline(id, reason) {
    try {
      await prismaClient.initiative.update({
        where: { id },
        data: {
          isApproved: false,
          isDeclined: true,
          declineReason: reason
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }
}

export { InitiativeTypesRepository as I, NewsRepository as N, RegionsRepository as R, InitiativeRepository as a };
