
wait_for_task_completion() {
    #pbar_str="▇"
    pbar_str="#"
    pbar_time_based=$1
    if [ $pbar_time_based -eq 1 ]
    then
        seconds_to_wait=$2
        echo -n "["
        for p in $(seq 1 $seconds_to_wait)
        do
            echo -n "."
        done
        echo -ne "]\r["
        pbar_control=$3
        if [ $pbar_control -eq 0 ]
        then 
            until [ $seconds_to_wait -eq 0 ]
            do
                echo -n "${pbar_str}"
                sleep 1
                let seconds_to_wait=seconds_to_wait-1
            done
            echo ""
        fi
    else
        pid_to_poll=$2
        echo -ne "\r"
        until [ `ps -p $pid_to_poll|grep -c $pid_to_poll` -eq 0 ]
        do
            echo -n "${pbar_str}"
            sleep 1
        done
        echo ""
    fi
}

wait_for_task_completion 1 10 0
echo -----------------
wait_for_task_completion 1 10 1
echo "last line"
sleep 20 &
w_pid=$!
echo $w_pid
wait_for_task_completion 0 $w_pid 
echo "done"


