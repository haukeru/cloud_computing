url=$1
calls=$2
agents=$3

for i in $(seq 1 $agents)
do
    curl -s "$url?[1-$calls]" &
    pidlist="$pidlist $!"
done

FAIL=0
for job in $pidlist
do
    # echo $job
    wait $job || let "FAIL+=1"
done

if [ "$FAIL" == "0" ]
then
    echo "Test abgeschlossen!"
else
    echo "Test fehlgeschlagen! ($FAIL)"
fi