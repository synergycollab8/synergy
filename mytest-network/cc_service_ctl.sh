#!/bin/bash


CC_SERVICES="chaincodeserviceclient chaincodeservicedocument chaincodeservicechat"
EVENT_CC_SERVICES="eventhandler/blockEventListenerChat1.js eventhandler/blockEventListenerdocument.js eventhandler/blockEventListenerNew1.js"

BASE_DIR=/app/hyperledger-fabric/mytest-network
LOG_DIR=$BASE_DIR/cc_svc_logs

. $BASE_DIR/../scripts/helper_utils

mkdir -p $LOG_DIR

cc_start() {
  for svc in $CC_SERVICES
  do
    if [ -f $BASE_DIR/$svc/server.js ]; then
      infoln "Starting the CC services - $svc"
      cd $BASE_DIR/$svc
      nohup node $BASE_DIR/$svc/server.js >& $LOG_DIR/${svc}.log &
      echo $! > $LOG_DIR/${svc}.pid
    else
      errorln "Required file $BASE_DIR/$svc/server.js NOT found ..."
    fi
  done
}

cc_stop() {
  for svc in $CC_SERVICES
  do
    if [ -f $LOG_DIR/${svc}.pid ]; then
      infoln "Stopping the CC services - $svc"
      kill -15 $(cat $LOG_DIR/${svc}.pid)
    else
      errorln "PID file $LOG_DIR/${svc}.pid NOT found ..."
      ps -ef | grep $svc | grep -v grep | awk '{print $2}'|xargs kill -15
    fi
  done
}

event_cc_start() {
  for svc in $EVENT_CC_SERVICES
  do
    if [ -f $BASE_DIR/$svc ]; then
      infoln "Starting the Event CC services - $svc"
      cd $BASE_DIR/$(dirname $svc)
      nohup node $BASE_DIR/$svc >& $LOG_DIR/$(basename $svc | sed 's/.js/.log/g') &
      echo $! > $LOG_DIR/$(basename $svc | sed 's/.js/.pid/g')
    else
      errorln "Required file $BASE_DIR/$svc NOT found ..."
    fi
  done
}

event_cc_stop() {
  for svc in $EVENT_CC_SERVICES
  do
    if [ -f $LOG_DIR/$(basename $svc | sed 's/.js/.pid/g') ]; then
      infoln "Stopping the Event CC services - $svc"
      kill -15 $LOG_DIR/$(basename $svc | sed 's/.js/.pid/g')
    else
      errorln "PID file $LOG_DIR/$(basename $svc | sed 's/.js/.pid/g') NOT found ..."
      ps -ef | grep $svc | grep -v grep | awk '{print $2}'|xargs kill -15
    fi
  done
}

arg=$1
case $arg in 
  "start") 
          print_header "Start CC Services"
          cc_start
          wait_for_seconds 60
          print_header "Start EVENT CC Services"
          event_cc_start
          ;;
  "stop")
          print_header "Stop CC Services"
          cc_stop
          print_header "Stop EVENT CC Services"
          event_cc_stop
          ;;
  *) fatalln "Invalid option!! use start or stop only"
esac

