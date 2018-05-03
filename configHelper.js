const fs = require('fs');
const path = require('path');
const os = require('os');

const applicationPath = path.join(os.homedir(), 'Documents/info');
const configDirectoryPath = path.join(applicationPath, 'config');
const configFilePath =  path.join(applicationPath, 'config/index.js');
const errMsg = '写入配置文件失败，请重试';

fs.exists(applicationPath, (res) => {
    if (!res)
        fs.mkdir(applicationPath);
});

function WriteConfig(config) {
    return new Promise((resolve, reject) => {
        fs.writeFile(configFilePath, JSON.stringify(config), (err) => {
            if (err) {
                reject({
                    code: 1,
                    msg: errMsg,
                });
            } else {
                resolve();
            }
        });
    });
}

function ReadConfig() {
    return new Promise(function(resolve, reject) {
        fs.exists(configDirectoryPath, (res) => {
            if (!res) {
                fs.mkdir(configDirectoryPath, (err) => {
                    fs.open(configFilePath, 'a+', (errOpen, res) => {
                        if(errOpen)
                            reject(errOpen);
                        else
                            resolve([]);
                    });
                });
            }
            else {
                fs.readFile(configFilePath, 'utf8', (err, data) => {
                    if (err) 
                        reject({
                            code: 1,
                            msg: errMsg,
                        });
                    else
                        resolve(JSON.parse(data || '[]'));
                });
            }
        });
    });
}

function SetConfig(config) {
    return new Promise(function(resolve, reject) {
        ReadConfig().then((res) => {
            if (config.id) {
                res.map((item) => {
                    if (item.id === config.id) {
                        Object.assign(item, config);
                    }
                    return item;
                })
            } else {
                res.map((item) => item.checked = false);
                let id = res.length > 0 ? res[res.length - 1].id + 1 : 0;
                config.id = id;
                config.checked = true;
                res.push(config);
            }
            WriteConfig(res).then(() => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    });
}

function DelConfig(config) {
    return new Promise(function(resolve, reject) {
        ReadConfig().then((res) => {
            let index = res.findIndex(item => item.id === config.id);
            if (index > -1) {
                res.splice(index, 1);
                if (config.checked) {
                    res[res.length - 1].checked = true;
                }
                WriteConfig(res).then(() => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });
            }
        });
    });
}

function SelectConfig(config) {
    return new Promise(function(resolve, reject) {
        ReadConfig().then((res) => {
            res.map((item) => item.checked = item.id === config.id);
            WriteConfig(res).then(() => {
                resolve(res);
            }, (err) => {
                reject(err);
            });
        });
    });
}

exports.getConfig = ReadConfig;
exports.setConfig = SetConfig;
exports.delConfig = DelConfig;
exports.selectConfig = SelectConfig;