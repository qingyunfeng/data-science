
print(JSON.stringify(db.getUsers()));

print('Question1: How many unique users are there?');
var number_users = db.course.distinct("id_member").length;
print(number_users);

print('');
print('Question2: How many tweets(%) did the top 10 users measured by the number of messages) publish?');
var top_tweet = db.course.aggregate([{$group:{_id:"$id_member",count:{$sum:1}}},{$sort:{count:-1}},{$limit:10}]);
print(JSON.stringify(top_tweet));
print("")

print('Question3:What was the earliest and lastet data (YYYY-MM-DD HH:MM:SS) that a message was published?');
var late = db.course.find({},{"timestamp":1,"_id":0}).sort({timestamp: -1}).limit(1);
latest = late[0];
print('Latest date: '+ latest['timestamp']);
var early = db.course.find({},{"timestamp":1,"_id":0}).limit(1).sort({timestamp:1});
earliest = early[0];
print( 'Earliest date:'+ earliest['timestamp']);

print("")
print('Question4: What is the mean time delta between all message?');
var small = db.course.find({},{"timestamp":1,"_id":0}).limit(1).sort({timestamp:1});
var big = db.course.find({},{"timestamp":1,"_id":0}).sort({timestamp: -1}).limit(1);

function datetime_to_unix(datetime){
    var tmp_datetime = datetime.replace(/:/g,'-');
    tmp_datetime = tmp_datetime.replace(/ /g,'-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
    return parseInt(now.getTime()/1000);
}

smallest = small[0];
biggest = big[0];
var smalltime = smallest.timestamp;
var bigtime = biggest.timestamp;
var unixsmall = datetime_to_unix(smalltime);
var unixbig = datetime_to_unix(bigtime);

var delta=unixbig-unixsmall;
var sum= db.course.find().count();
print(delta/sum);
print("")

print('Question5: What is the mean length of a message?');
var length = 0;
var text = db.course.find({},{"text":1, "_id":0})
for ( var x=0;x<sum;x++){
length=length+text[x].text.toString().length;
}
print(length/sum);
print("")

print('Question7: What is the average number of hashtags(#)used within a message?');
var number = db.course.find({"text":/#/}).count();
var totalnumber = db.course.find({"text":{$ne:null}}).count();
print(number/totalnumber);
