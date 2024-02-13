"use strict";
// Copyright 2019-2022 @subwallet authors & contributors
// SPDX-License-Identifier: Apache-2.0
exports.__esModule = true;
exports.doAddWallet = void 0;
var wallets_1 = require("@subwallet/wallet-connect/dotsama/wallets");
// @ts-ignore
var ExampleWallet_svg_1 = require("./ExampleWallet.svg");
var doAddWallet = function () {
    (0, wallets_1.addWallet)({
        extensionName: 'example',
        title: 'New Wallet Example',
        installUrl: 'https://github.com/Koniverse/SubConnect/tree/master/packages/sub-connect/src/new-wallet-example',
        logo: {
            src: ExampleWallet_svg_1["default"],
            alt: 'New Wallet Example'
        }
    });
};
exports.doAddWallet = doAddWallet;
