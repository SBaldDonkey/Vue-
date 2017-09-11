
//存取localStorage中的数据
var store = {
    save(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    },
    fetch(key){
        return JSON.parse(localStorage.getItem(key)) || [];
    }
};
//过滤的时候有三种情况 all finished unfinished
var filter = {
    all:function(list){
        return list
    },
    finished:function(list){
        return list.filter(function(item){
            return item.isChecked
        })
    },
    unfinished:function(list){
        return list.filter(function(item){
            return !item.isChecked
        })
    }
}
var list = store.fetch("miaov-class");
var vm = new Vue({
    el:".main",
    data:{
        list:list,
        todo:"",
        edtorTodos:'', //记录正在编辑的数据
        beforeTitle:'', //记录正在编辑之前的数据
        visibility:'all'//通过这个属性值的变化对数据进行筛选
    },
    watch:{ //监控
        // list:function(){  //监控list这个属性,当这个属性对应的值发生变化就会执行函数
        //     store.save("miaov-class",this.list)
        // }
        list:{  //深层次的监控list下的数据
            handler:function(){
                store.save("miaov-class",this.list)
            },
            deep:true
        }
    },
    computed:{
        noCheckeLength:function(){
            return this.list.filter(function(item){
                return !item.isChecked
            }).length
        },
        filteredList:function(){
            return filter[this.visibility](list);
        }

    },
    methods:{
        addTodo(){  //添加任务
            //向list中添加一项任务
            //事件处理函数中的this指向的是，当前这个根实例
            if(this.todo === ""){return};
                this.list.push({
                    title:this.todo,
                    isChecked:false
                });
            this.todo = ""
        },
        deleteTodo(todo){ //删除任务
            var index = this.list.indexOf(todo);
            this.list.splice(index,1)
        },
        edtorTodo(todo){ //编辑任务
            //编辑任务的时候，记录一下编辑这条任务的title，方便在取消编辑的时候重新给之前的title
            this.beforeTitle = todo.title;
            this.edtorTodos = todo;
        },
        edtorTodoed(todo){ //编辑任务成功
            this.edtorTodos = "";
        },
        cancelTodo(todo){ //编辑任务取消
            todo.title = this.beforeTitle;
            this.beforeTitle ="";
            this.edtorTodos = "";
        }
    },
    directives:{
        "foucs":{
            update(el,binding){
                if(binding.value){
                    el.focus()
                }
            }
        }
    }
});
function watchHashChange(){
    var hash = window.location.hash.slice(1);
    vm.visibility = hash
}
window.addEventListener("hashchange",watchHashChange);
window.onload = function(){
    var oLi = document.getElementById("action");
    var oA = oLi.getElementsByTagName("a");
    for (var i=0;i<3;i++){
        oA[i].onclick = function(){
            oA[i].className = '';
            this.className = 'active';
        }
    }
}
