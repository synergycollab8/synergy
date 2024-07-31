/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const chathistorycontract  = require('./lib/chathistorycontract');

module.exports.ChatHistoryContract = chathistorycontract;
module.exports.contracts = [chathistorycontract];
