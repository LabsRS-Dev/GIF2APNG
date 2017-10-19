<template>
    <div class="children__router__content__topRank">
        <div class="children__router__content__topRank__content" v-for="item in allRankList" :key="item.id">
            <div class="children__router__content__topRank__title">{{item.name}}</div>
            <div class="children__router__content__topRank__body">
                <div class="children__router__content__topRank__body__top">
                    <div class="children__router__content__topRank__body__top__content" v-for="(el,index) in item.top" :key="el.id">
                        <img class="children__router__content__topRank__body__top__icon" :src="el.thumb"></img>
                        <span class="children__router__content__topRank__body__top__rank">{{index + 1}}</span>
                        <span class="children__router__content__topRank__body__top__name">{{el.name}}</span>
                        <span class="children__router__content__topRank__body__top__number">{{el[item.props]}}</span>
                    </div>
                </div>
                <div class="children__router__content__topRank__body__bottom">
                    <div class="children__router__content__topRank__body__bottom__content" v-for="(ele,index) in item.bottom" :key="ele.id">
                        <span class="children__router__content__topRank__body__bottom__rank">{{index + 4}}</span>
                        <img class="children__router__content__topRank__body__bottom__icon" :src="ele.thumb"></img>
                        <span class="children__router__content__topRank__body__bottom__name">{{ele.name}}</span>
                        <span class="children__router__content__topRank__body__bottom__number">{{ele[item.props]}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { BS, Util, _ } from 'dove.max.sdk'

    const modelPrefix ='rank-id-' + _.now()
    class Model {
        constructor(name,top,bottom,props){
            this.id = _.uniqueId(modelPrefix);
            this.name = name              // 排行榜名称
            this.top = top                // 排行榜前三
            this.bottom = bottom          // 排行榜四到八
            this.props = props            // 动态取值
        }
    }

    const rankPrefix ='rank-image-id-' + _.now()
    class Rank {
        constructor(name,thumb,browse,download,share,collect){
            this.id = _.uniqueId(rankPrefix);
            this.name = name              // 图片文件名称
            this.thumb = thumb            // 图片文件图标
            this.browse = browse          // 图片文件浏览次数
            this.download = download      // 图片文件下载次数
            this.share = share            // 图片文件分享次数
            this.collect = collect        // 图片文件收藏次数
        }
    }

    var allRankList = [];
    var topRankList = [];

    var hasInited = false;

    export default{
        data(){
            return{
                topRankList:topRankList,
                allRankList:allRankList
            }
        },
        mounted(){
            var that = this
            if(!hasInited){
                hasInited = true
                that.drawTopRankRetrieval()
            }
        },
        methods:{
            drawTopRankRetrieval(){
                var that = this
                _.each([
                    {fileName: 'gif001', fileThumb:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileBrowse:80,fileDownload:3,fileShare:2,fileCollect:98},
                    {fileName: 'gif002', fileThumb:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileBrowse:98,fileDownload:12,fileShare:11,fileCollect:89},
                    {fileName: 'gif003', fileThumb:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileBrowse:66,fileDownload:33,fileShare:32,fileCollect:68},
                    {fileName: 'gif004', fileThumb:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileBrowse:55,fileDownload:44,fileShare:43,fileCollect:57},
                    {fileName: 'gif005', fileThumb:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileBrowse:74,fileDownload:28,fileShare:27,fileCollect:73},
                    {fileName: 'gif006', fileThumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileBrowse:12,fileDownload:80,fileShare:79,fileCollect:21},
                    {fileName: 'gif007', fileThumb:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileBrowse:46,fileDownload:54,fileShare:53,fileCollect:47},
                    {fileName: 'gif008', fileThumb:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileBrowse:18,fileDownload:82,fileShare:81,fileCollect:19},
                    {fileName: 'gif009', fileThumb:'http://bbs.uc.cn/data/attachment/forum/month_0807/20080706_d162e4910d0a301fb136NkPw7m39KEOc.gif',fileBrowse:5,fileDownload:95,fileShare:94,fileCollect:6},
                    {fileName: 'gif010', fileThumb:'http://i5.bbs.fd.zol-img.com.cn/t_s240x240/g3/M0A/08/05/Cg-4V1Celt6ICLZpAAUPtUKK9n4AABhHwP51s8ABQ_N875.gif',fileBrowse:2,fileDownload:98,fileShare:97,fileCollect:3},
                    {fileName: 'gif011', fileThumb:'http://worldcup.sznews.com/humor/attachement/gif/site3/20140721/4487fcd7fc661537068e36.gif',fileBrowse:33,fileDownload:67,fileShare:66,fileCollect:34},
                    {fileName: 'gif012', fileThumb:'http://ww3.sinaimg.cn/bmiddle/6331b8ebgw1eglth1kwv4g205c074u0x.gif',fileBrowse:48,fileDownload:52,fileShare:51,fileCollect:49},
                    {fileName: 'gif013', fileThumb:'http://images6.fanpop.com/image/photos/35300000/cal-cal-calum-hood-35346616-180-240.gif',fileBrowse:35,fileDownload:65,fileShare:64,fileCollect:36},
                    {fileName: 'gif014', fileThumb:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candle-light-animated.gif/180px-Candle-light-animated.gif',fileBrowse:88,fileDownload:22,fileShare:21,fileCollect:89},
                    {fileName: 'gif015', fileThumb:'http://img0.pconline.com.cn/pconline/1404/08/4571216_2012043023524670421_thumb.gif',fileBrowse:54,fileDownload:46,fileShare:45,fileCollect:55},
                    {fileName: 'gif016', fileThumb:'http://img.zcool.cn/community/01d579578e4bed0000018c1b7c42ab.gif',fileBrowse:82,fileDownload:18,fileShare:17,fileCollect:83}
                ],function(ele){
                    let rankObj = new Rank(ele.fileName,ele.fileThumb,ele.fileBrowse,ele.fileDownload,ele.fileShare,ele.fileCollect)
                    that.topRankList.push(rankObj)
                })

                that.drawTopRankInfo()
            },
            drawTopRankInfo(){
                var that = this
                let browseTopList = _.sortBy(topRankList,'browse').reverse().slice(0,3)                     // 图片文件浏览次数前三位
                let browseBottomList = _.sortBy(topRankList,'browse').reverse().slice(3,8)                  // 图片文件浏览次数三到八
                let downloadTopList = _.sortBy(topRankList,'download').reverse().slice(0,3)                 // 图片文件下载次数前三位
                let downloadBottomList = _.sortBy(topRankList,'download').reverse().slice(3,8)              // 图片文件下载次数三到八
                let shareTopList = _.sortBy(topRankList,'share').reverse().slice(0,3)                       // 图片文件分享次数前三位
                let shareBottomList = _.sortBy(topRankList,'share').reverse().slice(3,8)                    // 图片文件分享次数三到八
                let collectTopList = _.sortBy(topRankList,'collect').reverse().slice(0,3)                   // 图片文件收藏次数前三位
                let collectBottomList = _.sortBy(topRankList,'collect').reverse().slice(3,8)                // 图片文件收藏次数三到八
                _.each([
                    {fileName:'浏览榜单',fileTop:browseTopList,fileBottom:browseBottomList,fileProps:'browse'},
                    {fileName:'下载榜单',fileTop:downloadTopList,fileBottom:downloadBottomList,fileProps:'download'},
                    {fileName:'分享榜单',fileTop:shareTopList,fileBottom:shareBottomList,fileProps:'share'},
                    {fileName:'收藏榜单',fileTop:collectTopList,fileBottom:collectBottomList,fileProps:'collect'}
                ],function(ele){
                    let allRankObj = new Model(ele.fileName,ele.fileTop,ele.fileBottom,ele.fileProps)
                    that.allRankList.push(allRankObj)
                })

                return allRankList
            }
        }
    }
</script>