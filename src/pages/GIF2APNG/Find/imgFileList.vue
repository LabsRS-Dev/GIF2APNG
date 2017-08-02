<template>
        <div class="imageList__router__content__image__browse__info">
            <div class="imageList__router__content__image__browse__message" v-for="item in formList">
                <span class="imageList__router__content__image__browse__message__name">{{item.introduce}}</span>
                <span class="imageList__router__content__image__browse__message__icon"><img :src="item.image"></img></span>
            </div>
        </div>
</template>
<script>

    import { BS, Util, _ } from 'dove.max.sdk'
    import {Transfer} from '../../../bridge/transfer.js'

    const formPrefix ='form-image-id-' + _.now()
    class Form {
       constructor(name,image,introduce){
           this.id = _.uniqueId(formPrefix);
           this.name = name              // 图片文件名称
           this.image = image            // 图片文件图标
           this.introduce = introduce    // 图片描述
       }
   }
   var formList =[];
   var hasInited = false;

   export default{
     data(){
         return{
            formList:formList,
            showLoading:false
         }
     },
     mounted(){
         var that = this
         if(!hasInited){
            hasInited = true
            Transfer.http.callEx('get.sets_items_order',{url:1},{},(info) => {
                _.each(info.data,function(ele){
                    var fileName = ele.Item.name
                    var fileImage = ele.Item.url
                    var fileIntroduce = ele.bewrite
                    let formObj = new Form(fileName,fileImage,fileIntroduce)
                    that.formList.push(formObj)
                })
                that.showLoading = !that.showLoading
                that.getLoadingInfo(that.showLoading)
            })
         }
     },
     methods:{
         getLoadingInfo(showLoading){
            var that = this
            that.$emit('data-loading', showLoading)
         }
     }
   }
</script>