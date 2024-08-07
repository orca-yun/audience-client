import { makeAutoObservable, autorun } from "mobx";
import { createContext, useContext } from "react";
import { makePersistable } from "mobx-persist-store";
import { Commodity, Gift, LiveBroadcastingRoom } from "@/api/types";
import { LIVE_STATUS } from "@/api/enum";

type Room = LiveBroadcastingRoom["room"] | null;

class Store {
  constructor() {
    makeAutoObservable(this, undefined, {
      autoBind: true,
    });

    makePersistable(this, {
      properties: ["userTokenMap"],
      name: "orca-audience",
      storage: window.localStorage,
    }).then((v) => {
      // console.log(v, "change state")
    });
  }

  roomKey = "";
  totalOnlineUsers = "";

  liveStatus: LIVE_STATUS | undefined = undefined;
  userTokenMap: { [key: number]: string } = {};
  roomInfo: Room = null;
  notice: string = ''

  gift: any = null;
  showLogin = false;
  giftList: Gift[] = [];
  recommendCommodity: Commodity | null = null;

  commodityList: Commodity[] = [];
  blocked: boolean = false;
  broadcastRoom: LiveBroadcastingRoom | null = null;

  toggleLogin = (bol: boolean) => (this.showLogin = bol);
  setUserTokenMap = (v: any) => {
    this.userTokenMap = { ...v };
  };
  setSendGift = (v: Gift | null) => {
    this.gift = v;
  };
  setRoomInfo = (v: Room) => {
    this.roomInfo = v;
  };
  setNotice = (v: string) => {
    this.notice = v;
  };
  setRoomKey = (v: string) => {
    this.roomKey = v;
  };
  setRecommendCommodity = (v: Commodity | null) => {
    this.recommendCommodity = v;
  };
  setGiftList = (v: Gift[]) => {
    this.giftList = v;
  };
  setCommodityList = (v: Commodity[]) => {
    this.commodityList = v;
  };

  setTotalOnlineUsers = (v: string) => {
    this.totalOnlineUsers = v;
  };
  logout = () => {
    delete this.userTokenMap[this.roomInfo!.id]
    this.setUserTokenMap(this.userTokenMap)
    this.setUserTokenMap({})
    localStorage.removeItem("orca-audience-token");
    localStorage.removeItem("orca-audience");
  };

  getCurrentToken = () => {
    let currentToken = null;
    if (this.roomInfo?.id) {
      currentToken = this.userTokenMap[this.roomInfo.id];
    }
    return currentToken;
  };
  setLiveStatus = (v: LIVE_STATUS) => (this.liveStatus = v);
  setBlocked = (v: boolean) => (this.blocked = v);
  setBroadcastRoom = (v: LiveBroadcastingRoom) => (this.broadcastRoom = v);
}

const store = new Store();
const context = createContext(store);
const useStore = () => useContext(context);

autorun(() => {
  if (store.blocked) {
    store.setLiveStatus(LIVE_STATUS.END);
  }
});

export { useStore, store, Store };
