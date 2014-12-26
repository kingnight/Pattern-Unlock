#手势解锁



![image](./patternlock.gif)
---
##API
###lock.init(parent id, callback,langType);
初始化

parent id: 绑定DOM元素    
    
callback:初始化成功回调函数 
 
langType:提示信息语言设置（默认中文），可设置“cn”或“en”

### lock.setPattern(succCallback,failCallback);
设置锁
succCallback：成功回调函数
failCallback：失败回调函数

### lock.setPattern(succCallback,failCallback);
解锁

succCallback：成功回调函数
failCallback：失败回调函数

##Attribute 

###lock.isSetLock 
判断是否已设置锁


---


## change:

1)add two times check to make sure set pattern success

2)modify API 

**init code:**
    
    lock.init(parent id, callback,langType);
    
parent id: bind to DOM , generate lock pattern    
    
callback:after init callback functuion will run  
 
langType:default is chinese (cn / en)
    
**set pattern:**

	lock.setPattern(succCallback,failCallback);
	
if the setting pattern of two times has the same code, run succCallback, then run failCallback  
	
**unlock pattern:**

	lock.lockPattern(succCallback,failCallback);

unlock success , run succCallback, fail run failCallback



---

## original README

This is a pattern unlock screen, similar to the one on Android.  

Based on vamshi4001's code (https://github.com/vamshi4001/Android-Unlock-4-Web).

The pegs on the screen represent numbers, laid out like those on your phone dialer (1 in the top left, 9 in the bottom right).

init code:

lock.init(combination code, parent id, callback);

example:

lock.init('123', '#content', function() {
	$('#lock_container').hide(); console.log('donesky'); 
});