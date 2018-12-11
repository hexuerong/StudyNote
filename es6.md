# ES6 注意的笔记

## ES 与 JS

ES（ECMAScript）可以理解为一个标准，JS（JavaScript）理解为一个标准的实现。

## var 与 let

var和let都是定义变量的。它们的区别如下：

- var只有两种作用域：

    1. 全局作用域
    2. 函数内的局部作用域

- let只要遇到代码块（用`{}`包含起来的代码部分）就是一个作用域。

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

## const

const用于定义常量（最好定义常量写成大写的，比较符合语法规范）。一旦被定义了就不能改变了。**const声明和赋值必须同时完成，不能分开写。**
const的作用域与let的一样。

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

出现以上情况的原因是：对象赋值的时候是把**对象的指针**赋值。代码段1只是修改了值，并没有修改指针，不是修改了赋值，故并没有报错；而代码段2是把新的对象指针赋值给常量了，修改了赋值，故报错。

## 变量的结构赋值

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
    let [...a,c] = [1,2,3];
    console.log(a);//[1,2]
    console.log(c);//3
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

## 新增字符串方法

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

## 模板字符串

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