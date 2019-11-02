// 对象工具
export default class MapListUtil {
    constructor() {
    }

    /**
     * 从对象列表中获取键值列表
     * @param {*} mapList 对象列表
     */
    static getKeysFromMapList(mapList) {
        var keyList = [];
        mapList.forEach((item) => {
            keyList.push(Object.keys(item)[0]);
        });
        return keyList;
    }

    /**
     * 从对象列表中获取 某个键对应的对象
     * @param {*} mapList 对象列表
     * @param {*} key 键值
     */
    static getObjFromMapListByKey(mapList, key) {
        var obj = null;
        mapList.forEach((item) => {
            if (Object.keys(item)[0] == key) {
                obj = item;
            }
        });
        return obj;
    }

    /**
     * 新增对象并删除旧的
     * @param {*} mapList 对象列表
     * @param {*} obj 新增对象
     */
    static addNewAndRemoveOld(mapList, obj) {
        var keyList = MapListUtil.getKeysFromMapList(mapList);
        var index = keyList.findIndex((item) => {
            return item == Object.keys(obj)[0];
        })
        if (index == -1) {
            mapList.push(obj);
        }
        else {
            mapList.splice(index, 1, obj);
        }
        return mapList;
    }
}