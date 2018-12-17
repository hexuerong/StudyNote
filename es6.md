# ES6 注意的笔记

## ES 与 JS

ES（ECMAScript）可以理解为一个标准，JS（JavaScript）理解为一个标准的实现。

## var 与 let

var和let都是定义变量的。它们的区别主要是由于作用域的不同：

- var只有两种作用域：

    1. 全局作用域。（for循环的小括号中定义的变量是全局的变量）
    2. 函数内的局部作用域

- let只要遇到代码块（用`{}`包含起来的代码部分）就是一个作用域。（块级作用域）

``` js
var a = 1;
function foo () {
    if(false){
        var a = 2;
    }
    console.log(a);
}
foo();
//以上代码执行结果为undefined。
//在函数foo中，a变量被提升到函数内最顶部了，但是并没有给a赋值，故输出undefined。
```

``` js
let a = 1;
if (true) {
    console.log(a);//报错 a is not defined   //TDZ开始 （暂时性死区）
    let a = 5;                              //TDZ结束
}
//这是因为let没有预解析，不存在变量提升
```

let注意：

1. let没有预解析，不存在变量提升。
2. 同一作用域里let不能重复定义。
3. for循环，for的小括号里面相当于是一个父级作用域，花括号里面相当于一个子级作用域。
4. var定义的全局变量是属于window的，而let和const定义的全局变量则不是。

``` js
for(let i = 0;i < 3; i ++){
    let i = 'abc';
    console.log(i);//执行三次，每次输出 'abc'
}
console.log(i);//报错 i is not defined
```

let 与 var 在for循环中：

``` js
//代码段一
var arr = [];
for(var i = 0;i < 5;i ++){
    arr[i] = function () {
        console.log(i);
    }
}
arr[3]();//输出5 //这里是因为for循环小括号中var定义的变量是全局的，故取出的i是5

//代码段二
var arr = [];
for(let i = 0;i < 5;i ++){
    arr[i] = function () {
        console.log(i);
    }
}
arr[3]();//输出3
```

## const

const用于定义常量（最好定义常量写成大写的，比较符合语法规范）。**const的作用域与let的一样。**

- **const定义的值不能修改。**
- **const声明和赋值必须同时完成，不能分开写。**

``` js
let user = {name:'lili',age:18};
const SUPER_USER = user;
console.log(SUPER_USER);//输出{name:'lili',age:18}
SUPER_USER.age = 20;
console.log(SUPER_USER);//输出{name:'lili',age:20}
```

``` js
let user = {name:'lili',age:18};
const SUPER_USER = user;
console.log(SUPER_USER);//输出{name:'lili',age:18}
SUPER_USER = {};//报错
console.log(SUPER_USER);//不执行，无输出
```

出现以上情况的原因是：对象(对象包括数组)赋值的时候是把**对象的指针**赋值。代码段1只是修改了值，并没有修改指针，不是修改了赋值，故并没有报错；而代码段2是把新的对象指针赋值给常量了，修改了赋值，故报错。

扩展：

1. Object.freeze(对象);
    ``` js
    const arr = ['a','b'];
    arr.push('c');
    console.log(arr);//['a','b','c']

    const arr1 = Object.freeze(['a','b']);
    console.log(arr1);//['a','b']
    arr1.push('c');//报错 object is not extensible
    ```
2. 在 es6 之前没有块级作用域概念是如何模拟实现的？
    使用**立即执行函数**（IIFE）。
    ``` js
    (function(){
        // TODO
    })();
    ```

## 变量的解构赋值

特别有用，尤其是在数据请求的时候。（例如：ajax请求解析json）

- 数组
    ``` js
    let [a,b,c] = [1,2,3];
    console.log(a,b,c);//1,2,3
    //----------------------------
    let [a, ,c] = [1,2,3];
    console.log(a,c);//1,3
    //----------------------------
    let [a,b,c] = [1,2];
    console.log(a);//1
    console.log(b);//2
    console.log(c);//undefined
    //----------------------------
    let [a,...c] = [1,2,3];
    console.log(a);//1
    console.log(c);//[2,3]
    //----------------------------
    let [...a,c] = [1,2,3];//报错，...作为剩余运算符使用时，只能放在最后
    console.log(a);
    console.log(c);
    //----------------------------（指定默认值）
    let [a,b,c = 'default',d = 'default'] = [1,2,3];
    console.log(a);//1
    console.log(b);//2
    console.log(c);//3
    console.log(d);//'defualt'
    ```
    总结：数组的解构赋值中，顺序（索引）非常重要，如果顺序乱了，赋值就不正确了。
- 对象
    ``` js
    let obj = {
        a: 1,
        b: 2
    };
    //----------------------------
    let {a,b} = obj;
    console.log(a,b);//1,2
    //----------------------------
    let {a,c} = obj;
    console.log(a);//1
    console.log(c);//undefined
    //----------------------------
    let {a:A,b} = obj;//解构赋值重命名
    console.log(A);//1
    // 其实`let {a,b} = obj`相当于`let {a:a,b:b} = obj`。这里只不过简写了。
    console.log(b);//2
    console.log(a);//报错，a is not defined
    //----------------------------
    let a = 0;
    console.log(a);//0
    //{a,b} = obj;//这样会报语法错误，js解析器会把花括号中的内容解析为代码块
    ({a,b} = obj);//这样写就会处理成语句
    console.log(a);//1
    //----------------------------（指定默认值）
    let {a = 1,b = 2} = {a: 10};
    console.log(a);//10
    console.log(b);//2
    //----------------------------（重命名后再指定默认值）
    let {a:A = 1,b = 2} = {a: 10};
    console.log(A);//10
    console.log(b);//2
    console.log(a);//报错，a is not defined
    //----------------------------
    let obj1 = {
        arr:[
            'heihei',
            {
                a: 1
            }
        ]
    };
    let {arr:[greet,{a}]} = obj1;
    console.log(greet);//'heihei'
    console.log(a);//1
    console.log(arr);//报错，arr is not defined
    //----------------------------（对象解构赋值可以结构方法）
    let {floor,pow} = Math;
    console.log(floor(1.1));//1
    console.log(floor(1.9));//1
    //----------------------------（交换两个变量的值）
    let a = 5,b = 10;
    [a, b] = [b, a];
    console.log(a,b);//10,5
    ```
    总结：对象的解构赋值中，顺序不再重要，名称非常重要。
- 其他
    ``` js
    // 解构字符串
    let { length } = 'you';
    console.log(length);//3
    let {a,b,c} = 'you';
    console.log(a);//y
    console.log(b);//o
    console.log(c);//u
    // 解构函数传参
    let arr = [1,2];
    let obj = { b:2, a:1 };
    let obj1 = { a:1 };
        //传统方法
    test(arr[0],arr[1]);
    function test(a,b) {
        console.log(a);//1
        console.log(b);//2
    }
        //es6（数组传参）
    test1(arr);
    function test1([a,b]) {
        console.log(a);//1
        console.log(b);//2
    }
        //es6（对象传参）--不用在意参数的顺序
    test2(obj);
    function test2({a,b}) {
        console.log(a);//1
        console.log(b);//2
    }
        //es6（设置参数默认值）
    test3(obj1);
    function test3({a,b = 10}) {
        console.log(a);//1
        console.log(b);//10
        //传统方法：b = b || 10;
    }
    ```

## 新增字符串方法 及 模板字符串

- 判断字符串中是否存在某子串
    ``` js
    let str = 'you';
    //传统方法
    console.log(str.indexOf('y') !== -1);//true
    //es6
    console.log(str.includes('y'));//true
    //es6判断开头的子串
    console.log(str.startsWith('y'));//true
    //es6判断结束的子串
    console.log(str.endsWith('u'));//true
    ```
- 重复字符串
    ``` js
    let str = 'you';
    console.log(str.repeat(3));//youyouyou
    ```
- 填充字符串（不常用，这里不讲了）
    str.padStart(最终字符串长度,要填充的内容);//在开头填充
    str.padEnd(最终字符串长度,要填充的内容);//在结尾填充
- 模板字符串
    将字符串用``包括起来。模板里面可以直接写变量（通过特殊语法），且模板里面还可以嵌套模板。
    ``` js
    // 传统方法
    var title1 = '2018新款 女士 雪地靴';
    var tpl1 = '<div>'+
                '<span>'+ title1 +'</span>'
                +'</div>';
    // es6方法
    let title2 = '2018新款 羊绒毛衣';
    let des = '男士';
    let tpl2 = `
        <div>
            <span>${title2 + `<span>${des}</span>` }</span>
        </div>
    `
    console.log(tpl2);
    // <div>
    //     <span>2018新款 羊绒毛衣<span>男士</span></span>
    // </div>
    ```

## 扩展运算符 即 rest运算符（三个点）

- 展开数组
    ``` js
    //[1,2,3] -> ...a -> 1,2,3
    let arr = [1,2,3];
    console.log(arr);//[1,2,3]
    console.log(...arr);//1,2,3
    ```
- 重置(rest)为数组
    ``` js
    // 1,2,3 -> ...a -> [1,2,3]
    function show (...a) {
        console.log(a);
    }
    show(1,2,3);//输出 [1,2,3]
    ```
- 剩余运算符
    必须放到最后
    ``` js
    function show a,b,...c) {
        console.log(a,b,c);
    }
    show(1,2,3,4,5);//输出 1,2,[3,4,5]
    //------------
    function show (...a,b,c) {
        console.log(a,b,c);
    }
    show(1,2,3,4,5);//报错 ...作为剩余运算符使用时，必须放到最后。
    ```
- 应用
    应用于复制数组。
    ``` js
    let arr = [1,2,3];
    console.log(arr);//[1, 2, 3]
    let arr2 = arr;
    arr2[0] = 0;
    console.log(arr);//[0, 2, 3]
    console.log(arr2);//[0, 2, 3]
    ```
    造成如上问题是因为数组和对象在直接赋值的时候是把其指针赋值给另外一个变量，故两个变量的指针一样，修改某一变量的值另一变量也一样变化了。改为：
    ``` js
    let arr = [1,2,3];
    console.log(arr);//[1, 2, 3]
    let arr2 = [...arr];
    arr2[0] = 0;
    console.log(arr);//[1, 2, 3]
    console.log(arr2);//[0, 2, 3]
    //也可以用深拷贝等其他方法，这里只是用...来示例
    ```

## 函数

1. 函数默认参数
    ``` js
    function show(a = 0,b = 0) {
        console.log(a,b);
    }
    show(1,2);//输出 1,2
    show(1);//输出 1,0
    show();//输出 0,0
    ```
2. 函数参数默认已经声明了，不能在函数内再用let、const再声明，会报错
    ``` js
    function show(a = 0,b = 0) {
        let a = 2;//报错 重复定义了
    }
    ```
3. 箭头函数
    基本语法：
    - 一个参数 => 返回值
    - (参数) => 返回值
    - (参数) => {
            //TODO
            return xxx;
        }

    注意：
    - **箭头函数会改变this的指向**
        箭头函数内部的this指向的是定义函数时所在的对象，而不是运行时所在的对象。
    - **箭头函数里面没有`arguments`**
        可以用解构赋值和`...`
    - **箭头函数不能当构造函数**

## 数组

- 循环遍历
    1. for()
    2. while
    3. `arr.forEach()`，`arr.map()`，`arr.filter()`，`arr.some()`，`arr.every()`
        这些方法的 `参数` 及 `回调函数的参数` 都一样（ES5就有了的），后面不再单独说明。
        ``` js
        let arr = ['a','b','c'];
        arr.forEach((value,index,arr) => {
            console.log(value,index,arr);
            //value是值，index是索引值，arr是整个数组
        });
        ```
        其实这些方法都是可以传两个参数的。
        `arr.forEach(回调函数,this的指向)`
        注意：由于箭头函数修改了this的指向，所以传第二个参数进去修改this的指向是没有用的。
        ``` js
        let arr = [1,2,3];
        let obj = {};
        arr.forEach(function(value,index,arr){
            console.log(this);//指向的是Window
        });
        arr.forEach(function(value,index,arr){
            console.log(this);//指向的是obj
        },obj);
        arr.forEach((value,index,arr) => {
            console.log(this);//指向的是window
        },obj);
        ```
        - arr.forEach() //与for循环类似
        - arr.map()
            和return搭配使用。如果在回调函数中没有return，则和forEach一样；如果有return则是修改的数组的单项，然后返回新的数组。（forEach的回调函数中写return没有任何作用）
            ``` js
            let arr = [1,2,3];
            let newArr = arr.map(function(value,index,arr){
                return value * 2;
            });
            console.log(arr);//[1, 2, 3]
            console.log(newArr);//[2, 4, 6]
            ```
            在整理数据的结构的时候用的比较多。
        - arr.filter()  //过滤数据，返回新的数组
        - arr.some()    //相当于查找，判断数组里面是否有符合条件的数据，返回布尔值
        - arr.every()   //判断数组里面的所有数据是否都符合条件，返回布尔值
    4. for...of...
        见Set数据结构的遍历循环。
        arr.keys()、arr.values()、arr.entries()
        区别对象的使用：
        Object.keys(obj)、Object.values(obj)、Object.entries(obj)
- es6新增
  - Array.from()
    将伪数组（类数组）对象转换为数组。只要有**索引和`length`属性**的都可以用from转换。
    ``` js
    function show(){
        console.log(arguments);
        // let arr = [].slice.call(arguments);//老方法
        let arr = Array.from(arguments);
        console.log(arr);//[1,2,3]
    }
    show(1,2,3);
    ```
    ``` js
    //代码块1
    let obj = {
        name: 'lili',
        age: 10
    }
    let arr = Array.from(obj);
    console.log(arr);//[]   //转换不成功
    //代码块2
    let obj = {
        0: 'lili',
        1: 10,
        length: 2
    }
    let arr = Array.from(obj);
    console.log(arr);//["lili", 10]
    ```
  - Array.includes()
    判断数组中是否有某个值。返回布尔值。
  - Array.of()
    将一组数据转换为数组，返回数组。
  - arr.find()
    查找数组arr中是否有符合条件的值，返回第一个符合条件的值，如果没有则返回undefined。
  - arr.findIndex()
    查找数组arr中是否有符合条件的值，返回第一个符合条件的值的索引，如果没有则返回-1。
  - arr.fill()
    填充某个数组。`arr.fill(要填充的值,要填充的起始索引,要填充的结束索引)`。第二个和第三个参数可以不填，不填则默认填充整个arr数组。

## 对象

- 对象的简洁语法（非常有用）
    ``` js
    let a = 1,b = 2;
    let obj = {
        a: a,
        b: b,
        show: function(){
            console.log(this.a);//1
        }
    };
    obj.show();
    //简写为：
    let obj1 = {
        a,
        b,
        show () {
            console.log(this.a);//1
        },
        showA: () => {//注意：这里最好不要用箭头函数，因为修改了this的指向。一定要注意这个问题
            console.log(this.a);//undefined
        }
    }
    obj1.show();
    obj1.showA();
    ```
- 对象新增方法
  - Object.assign()
    语法：`let 新的对象 = Object.assign(目标对象,source1,source2,source3...)`
    用途：
    1. 合并对象（比如在有默认参数和用户参数的时候，需要得到新的参数）
        ``` js
        let obj = {a:1},
            obj1 = {b:2},
            obj2 = {a:4,c:3};
        let newObj = Object.assign({},obj,obj1,obj2);
        console.log(newObj);//{a:4,b:2,c:3}
        ```
        特性：*若有同名属性，后面的source的属性会覆盖前面的source的属性。*
    2. 复制一个对象（浅拷贝）
        ``` js
        let obj = {
            a:1,
            b:2
        };
        let newObj = Object.assign({},obj);
        newObj.b = 3;
        console.log(newObj);//{a:1,b:3}
        console.log(obj);//{a:1,b:2}
        ```
        浅拷贝会存在的问题：如果原始对象的内部还有一个对象，那么浅拷贝原始对象，修改新对象内部对象的值时，原始对象内部对象的值也会变。
  - `Object.is(a,b)`
    用途：比较两个值是否相等。常见方法`==`、`===`
    ``` js
    console.log('a' == 'b');//false
    console.log(Object.is('a','b'));//false
    console.log('---------------');

    console.log(1 == '1');//true
    console.log(1 === '1');//false
    console.log(Object.is(1,'1'));//false
    console.log('---------------');

    //特殊地
    console.log(NaN == NaN);//false
    console.log(NaN === NaN);//false
    console.log(isNaN(NaN));//true
    console.log(Number.isNaN(NaN));//true //es6的规范写法
    console.log(Object.is(NaN,NaN));//true
    console.log('---------------');

    console.log(+0 == -0);//true
    console.log(+0 === -0);//true
    console.log(Object.is(+0,-0));//false
    ```
  - Object.keys(obj)
  - Object.values(obj)
  - Object.entries(obj)
- 对象扩展运算符`...`（ES2018就有了）
    ``` js
    let obj = {
        a:1,
        b:2,
        c:3,
        d:4
    };
    let {a,b,...c} = obj;
    console.log(a);//1
    console.log(b);//2
    console.log(c);//{c: 3, d: 4}
    //还可以用来复制对象（浅拷贝）
    let newObj = {...obj};
    newObj.a = 0;
    console.log(newObj);//{a: 0, b: 2, c: 3, d: 4}
    console.log(obj);//{a: 1, b: 2, c: 3, d: 4}
    ```

## Promise

主要作用：解决异步回调冗杂、可读性低的问题。
`Promise`是一个构造函数（接受一个函数作为参数），用来生成`Promise`实例。

基本语法：

``` js
new Promise((resolve,reject) => {
    //resove和reject是两个函数，由 JavaScript 引擎提供，不用自己部署。
    //resove是成功时调用
    //reject是失败时调用
    true ? resolve('成功') : reject('失败');
});
```

- promise.then()
    `promise.then()`返回的是一个新的Promise实例，因此可以采用链式写法（即then后面再写一个then方法`promise.then().then()`）。
    then方法接收两个参数：`promise.then(success, fail)`。第二个参数可选。
    ``` js
    let promise = new Promise((resolve,reject) => {
        false ? resolve('成功') : reject('失败');
    });
    promise.then(res => {
        console.log(res);
    },err => {
        console.log(err);//执行这句，输出：'失败'
    });
    ```
    一般来说，不要在then方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。
- promise.catch()
    catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法。
    **在发生错误时，catch方法会被调用。**
    以上then方法可以改为如下（且这样更稳妥）：
    ``` js
    promise.then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);//执行这句，输出：'失败'
    });
    ```
    同时，**在then中抛出一个错误也会被catch捕获。**
    ``` js
    let promise = new Promise((resolve,reject) => {
        true ? resolve('成功') : reject('失败');
    });
    promise.then(res => {
        console.log(res);
        throw Error('错误');//抛出了错误
    }).catch(err => {
        console.log(err);//catch这里捕获了then中的错误
    });

    promise.then(res => {
        console.log(res);
        throw Error('错误');//抛出了错误没有被任何地方捕获，浏览器提示错误未被捕获
    },err => {
        console.log(err);
    });
    ```
    Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，**错误总是会被下一个catch语句捕获**。（promise链式调用时，无论是then还是catch中的错误都会被下一个catch捕获）

下面是一个用promise实现的常见的登录请求数据的模拟：

``` js
let getToken = (resolve, reject) => {
    //请求数据，这里用setTimeout模拟
    setTimeout(function(){
        resolve({status:1,token:'asdawfbgh'});
    },1000);
    /* $.ajax({
        url: '/getToken',
        type: 'post',
        data: {
            userName: 'lili',
            password: '******'
        },
        success:function(data){
            resolve(data);
        },
        error:function(errMsg){
            reject(errMsg);
        }
    }) */
};

let login = (resolve, reject) => {
    setTimeout(function(){
        resolve({status:1,msg:'登录成功'});
    },2000);
};

let getUserInfo = (resolve, reject) => {
    setTimeout(function(){
        resolve({status:1,userName:'lili',age:18,phone:'181****1234'});
    },1000);
};

new Promise(getToken)
    .then(res => {
        console.log('获取token成功');
        console.log(res);//{status: 1, token: "asdawfbgh"}
        return new Promise(login);
    })
    .then(res => {
        console.log('登录成功');
        console.log(res);//{status: 1, msg: "登录成功"}
        return new Promise(getUserInfo);
    })
    .then(res => {
        console.log('获取用户信息成功');
        console.log(res);//{status: 1, userName: "lili", age: 18, phone: "181****1234"}
    })
    .catch(err => {
        console.log(err);
    });
```

- Promise.resolve()
    将传入的值转换成一个Promise对象，并且是resolve，即成功的。
    ``` js
    let promise = Promise.resolve('aaa');
    promise.then(res => {
        console.log(res);//执行这一步，输出：'aaa'
    }).catch(err => {
        console.log(err);
    });
    ```
- Promise.reject()
    将传入的值转换成一个Promise对象，并且是reject的，即失败的。
- Promise.all()
    传入参数是数组。（将一组Promise实例包装成一个新的Promise实例。）（如果数组中不是Promise实例，就会先调用Promise.resolve方法，将参数转为 Promise 实例。）
    只有当数组里面的Promise实例全是resolve状态的时候，新实例才会变为resolve状态，否则是reject。
    ``` js
    let a = Promise.resolve('aaa');
    let b = Promise.resolve('bbb');
    let c = Promise.reject('ccc');
    Promise.all([a,b,c]).then(res => {
        console.log(res);//由于c不是resolve状态的，故不执行resolve，这里并没有输出。
    });
    ```
- Promise.race()
    参数与`Promise.all()`的一样。
    新实例的状态与参数中最先返回状态的实例保持一致。

## generator函数

生成器。执行 Generator 函数会返回一个遍历器对象。可以把 Generator 理解为一个状态机，封装了多个内部状态。

用来解决异步，深度嵌套的问题。

- generator函数的特征：
  - function和函数名之间有`*`号。
  - 函数体里面有`yield`表达式。
- generator函数的声明：
    ``` js
    function * show(){
    //function *show(){//效果一样(`*`不管左右是否有空格都一样，不影响定义)
    //function* show(){//效果一样
        yield 'welcome';
        yield 'to';
        return 'ending';
    }
    //该函数有三个状态：welcome，to 和 return 语句（结束执行）。
    ```
- generator函数的使用：
    调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象。下一步，必须调用遍历器对象的next方法，使得指针移向下一个状态。
    ``` js
    let g = show();
    console.log(g);//输出generator对象
    console.log(g.next());//{value: "welcome", done: false}
    console.log(g.next());//{value: "to", done: false}
    console.log(g.next());//{value: "ending", done: true}
    console.log(g.next());//{value: undefined, done: true}
    //输出值中：
    //value属性就是当前yield的值。
    //done属性的值表示遍历是否结束，true表示结束。
    ```
    每次调用next方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个yield表达式（或return语句）为止。换言之，**Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行**。
- next 方法的参数
    yield表达式本身没有返回值，或者说总是返回undefined。**next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。**
    ``` js
    function * show(){
        let userName = yield `lili`;
        let data = yield `我的名字是${userName}`;
    }
    let g = show();
    console.log(g.next());//{value: "lili", done: false}
    console.log(g.next('hh'));//{value: "我的名字是hh", done: false}
    ```
    如果想要第一次调用next方法时，就能够输入值，可以在 Generator 函数外面再包一层。
- yield注意：
  - yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。
  - yield表达式用作函数参数或放在赋值表达式的右边，可以不加括号。
  - yield表达式如果用在另一个表达式之中，必须放在圆括号里面。
    ``` js
    function* demo() {
    console.log('Hello' + yield); // SyntaxError
    console.log('Hello' + yield 123); // SyntaxError

    console.log('Hello' + (yield)); // OK
    console.log('Hello' + (yield 123)); // OK
    }
    ```
- generator函数返回值的遍历
    手动用next方法调用比较麻烦。for ... in ...无法调用。
  - for ... of ...遍历
    ``` js
    for(let p of g){
        console.log(p);//依次输出 welcome to
    }
    //注意：return的东西不会遍历
    ```
  - 解构赋值
    ``` js
    let [a,...b] = g;
    console.log(a);//welcome
    console.log(b);//["to"]
    //注意：只解构yield的值
    ```
  - 扩展运算符
    ``` js
    console.log(...g);//welcome to
    ```
  - Array.from()
    ``` js
    console.log(Array.from(g));//["welcome", "to"]
    ```
- 同步与异步
  同步：连续执行，上一个操作没有完成，下一个操作不能进行。
  异步：不连续，上一个操作没有完成，下一个操作可以执行。
  异步解决方案：
  - 回调函数。（callback）
  - 事件监听。（addEventListener）
  - 发布/订阅 模式。（emit 与 on）
  - Promise对象。
  - async。（ES2017规定的）

## async 与 await

## 模块化

AMD、CMD、CommonJS、ES6模块化。
最早是由社区提出的CommonJS规范。

## 类(class) 与 继承(extends)

## 新的数据类型 —— Symbol (平时使用率一般)

原来的基本数据类型：Number、String、Boolean、Object、null、undefined。（Array、Function属于Object）

``` js
//需要注意的是typeof null返回为object,因为特殊值null是一个空的对象引用（空对象指针）。
console.log(typeof null);//object
```

现在要再新加一种数据类型Symbol。**Symbol每次创建的时候值都不一样。**

注意：

1. Symbol不能new。
2. Symbol返回的是一个唯一的值。（主要做一个key，定义唯一的或者是私有的东西）
3. Symbol是一个单独的数据类型。就叫symbol，基本数据类型。
4. Symbol如果作为对象的key，用for in循环无法遍历出来。

``` js
let a = Symbol();
//Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述(不影响值)，主要是为了在控制台显示，或者转为字符串时，比较容易区分。例：let a = Symbol('symbol1');
let b = Symbol();
console.log(a === b);//false
```

**Symbol 值不能与其他类型的值（包括字符串）进行运算**，会报错。但是，Symbol 值可以显式转为字符串。也可以转为布尔值，但是不能转为数值。

``` js
//转为字符串
let sym = Symbol('My symbol');
console.log( String(sym) ); // 'Symbol(My symbol)'
console.log( sym.toString() ); // 'Symbol(My symbol)'

//转为bool值
Boolean(sym);
console.log( Boolean(sym) ); // true
console.log( !sym );  // false
if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```

Symbol的最大用处：**作为一个对象的属性名称，防止对象的属性名被重写。**

理解：下面这个还是被修改了。

``` js
let obj = {};
let name = Symbol();
obj[name] = 'Lili';
console.log(obj);//{Symbol(): "Lili"}
obj[name] = 'Bob';
console.log(obj);//{Symbol(): "Bob"}
```

这个示例就未被修改

``` js
let person = {};
let name = Symbol('symbol1');

{
    person[name] = 'Lili';
    console.log(person[name]);//Lili
    console.log(person);//{Symbol(symbol1): "Lili"}
}

{
    let name = Symbol('symbol2');
    person[name] = 'Bob';
    console.log(person[name]);//Bob
    console.log(person);//{Symbol(symbol1): "Lili", Symbol(symbol2): "Bob"}
}

console.log(person[name]);//Lili
console.log(person);//{Symbol(symbol1): "Lili", Symbol(symbol2): "Bob"}
```

## generator

## Set

Set是一种新的数据结构。它类似于数组，但是**成员的值都是唯一的，没有重复的值。**
Set是一个构造函数，初始化时里面可以传一个数组。（只能是数组）

``` js
let arr = [1,2,3,3];
console.log(arr);//[1,2,3,3]
let set = new Set([1,2,3,3]);
console.log(set);//{1,2,3}
```

``` js
//Set的属性和方法
let set = new Set();
set.add('a');//添加
set.add('b').add('c');//由于Set的方法调用后返回新的set，故可以进行链式调用
console.log(set.size);//3 属性：获取set的大小（长度）
console.log(set.has('d'));//false 判断是否有某个值
console.log(set.has('b'));//true
set.delete('a');//删除
set.clear();//清除set中的全部值
```

``` js
//Set的循环遍历
let set = new Set(['a','b','c']);

for (const item of set) {//默认是取的values
    console.log(item);//a //b //c
}

for (const item1 of set.keys()) {
    console.log(item1);//a //b //c
}

for (const item2 of set.values()) {
    console.log(item2);//a //b //c
}

for (const item3 of set.entries()) {
    console.log(item3);//["a":"a"] //["b":"b"] //["c":"c"]
}

for (const [key,value] of set.entries()) {
    console.log(key,value);//a a    //b b    //c c
}

set.forEach(value => {
    console.log(value);//a //b //c
});
```

总结：**Set数据结构的key和value值一样。**

例：Set转换为数组

``` js
let set = new Set([1,2,3,4]);
let arr = [...set];
console.log(arr);//[1, 2, 3, 4]
```

例：数组去重

``` js
let arr = [1,2,3,4,5,4,3,2,1,3,3,4,2];
let newArr = [...new Set(arr)];
console.log(newArr);//[1, 2, 3, 4, 5]
```

## Map

## Proxy

Proxy是代理的意思。在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。
Proxy主要用于**扩展（增强）对象的一些功能。**

Proxy的作用：比如Vue中的拦截，
            预警、上报、扩展功能、统计、增强对象等等。

Proxy**其实是设计模式的一种，代理模式。**

``` js
var proxy = new Proxy(target, handler);
// new Proxy(被代理的对象, 对代理的对象做什么操作);
// handler是一个对象，里面都是函数
/* {
    get(){},//获取时要做的事情
    set(){},//设置时要做的事情
    deleteProxy(){},//删除
    has(){},//是否有 'xxx' in obj
    apply(){},//调用函数处理
    ...
} */
```

Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

``` js
let user = new Proxy({}, {
    get: function (target, property) {
        if (property == 'full_name') {
            return target.first_name + ' ' + target.last_name;
        }
    }
});
user.first_name = 'Bob';
user.last_name = 'Wood';
console.log(user.full_name);
```

例：实现访问一个对象中不存在的属性时，不返回undefined，而是报错。

``` js
let user = {
    name: 'Lili',
    age: 18
};
let obj = new Proxy(user, {
    get (target, property) {
        if (property in target) {
            return target[property];
        }else{
            throw ReferenceError(`${property} is not in this object`);
        }
    }
});
console.log(obj.name);//'Lili'
console.log(obj.age);//18
console.log(obj.sex);//报错
```

例：实现一个DOM对象，通过DOM.div()、DOM.a()、DOM.ul()等方法创建DOM的element且可以传参添加属性和子element。

``` js
const DOM = new Proxy({}, {
    get (target, property) {
        return function (attrs, ...children) {
            // 创建一个DOM节点
            let el = document.createElement(property);
            // 添加DOM标签的属性
            for (const key of Object.keys(attrs)) {
                el.setAttribute(key, attrs[key]);
            }
            // 添加子节点
            children.forEach(child => {
                if(typeof child == 'string'){
                    el.innerHTML += child;
                }else{
                    el.appendChild(child);
                }
            });
            return el;
        };
    }
});
let elDom = DOM.div({id:'myDiv',class:'testDiv'},
    '嘿嘿嘿',
    DOM.p({id:'myP',class:'testP'},
        '这个一个p标签形成的段落。',
        DOM.span({class:'testSpan'},
            '这是span。'
        )
    ),
    '好好好',
    DOM.ul({},
        DOM.li({},'这是一个li'),
        DOM.li({},'这是一个li'),
        DOM.li({},'这是一个li'),
        DOM.li({},'这是一个li')
    )
);
console.log(elDom);
window.onload = function () {
    document.body.append(elDom);
}
```

## Reflect