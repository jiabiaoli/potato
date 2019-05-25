<template>
    <div>
        <Row>
            <Col span="24"><Input v-model="q" type="textarea" :rows="8" placeholder="输入文字..."/></Col>
        </Row>
        <Row>
            <Col offset="1" span="4">
                <Select v-model="language" style="width: 100px">
                    <Option v-for="item in languages" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Col>
            <Col offset="1" span="6">
                <ButtonGroup>
                    <Button type="primary" @click="query">翻译</Button>
                    <Button @click="copy">复制结果</Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row>
            <Col span="24"><Input v-model="result" type="textarea" :rows="8" placeholder="翻译结果..."/></Col>
        </Row>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                language: 'auto,auto',
                q: '',
                result: '',
                appId: '',
                secret: '',
                languages: [
                    {
                        value: 'auto,auto',
                        label: "自动检测"
                    },
                    {
                        value: 'zh,en',
                        label: "中文>>英文"
                    },
                    {
                        value: 'en,zh',
                        label: "英文>>中文"
                    }
                ]
            }
        }, methods: {
            query() {
                let _this = this;
                if (this.q == '' || this.q.trim() == '') {
                    this.$Message.info("请输入待查询的文字");
                    return;
                }
                let salt = new Date().getTime()
                let from = this.language.split(",")[0];
                let to = this.language.split(",")[1];
                if (this.appId == '') {
                    _this.$Modal.confirm({
                        title: '信息提示',
                        content: '需要先设置APPID与秘钥,是否进行设置',
                        onOk: function () {
                            _this.$router.push("/settings");
                        }
                    })
                    return;
                }
                this.$http({
                    url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
                    method: 'post',
                    params: {
                        q: this.q,
                        from: from,
                        to: to,
                        salt: salt,
                        appid: this.appId,
                        sign: this.$md5(this.appId + this.q + salt + this.secret)
                    }
                }).then((result) => {
                    let status = result.data.error_code;

                    if (status == '52001') {
                        this.$Message.error("请求超时,请重试")
                    } else if (status == '52002') {
                        this.$Message.error("系统错误,请重试")
                    } else if (status == '52003') {
                        this.$Message.error("用户未抽授权,请检查APPID配置")
                    } else if (status == '54000') {
                        this.$Message.error("必填参数为空")
                    } else if (status == '54001') {
                        this.$Message.error("签名错误,请检查秘钥配置")
                        this.$router.push("/settings");
                    } else if (status == '54003') {
                        this.$Message.error("访问频率受限")
                    } else if (status == '54004') {
                        this.$Message.error("账户余额不足")
                    } else if (status == '54005') {
                        this.$Message.error("请求频繁,请降低请求频率")
                    } else if (status == '58000') {
                        this.$Message.error("客户端IP非法,请检查个人资料里填写的IP地址是否正确")
                    } else if (status == '58001') {
                        this.$Message.error("译文语言方向不支持")
                    } else if (status == '58002') {
                        this.$Message.error("服务当前已关闭,请前往管理控制台开启服务")
                    }
                    let trans_result=result.data.trans_result;
                    this.result='';
                    if(trans_result){
                        trans_result.forEach((tran)=>{
                            this.result+=tran.dst;
                        })
                        this.$db.findOne({type:'settings'},(err,docs)=>{
                            if(docs && docs.copy==true){
                                this.$ipc.send('copy',this.result)
                            }
                        })
                    }
                })
            }, init() {
                this.$db.findOne({type: 'settings'}, (err, docs) => {
                    if (docs) {
                        this.appId = docs.appid;
                        this.secret = docs.secret;
                    }
                });
            },copy(){
                if(this.result){
                    this.$ipc.send('copy',this.result)
                    this.$Message.success("复制成功")
                }else{
                    this.$Message.error("结果为空")
                }
            }
        }, created() {
            this.init();
            this.$ipc.on('forward-settings',(event,args)=>{
                this.appId=args.appId;
                this.secret=args.secret;
                this.$router.push("/")
            })
            this.$ipc.on('translate',(event,args)=>{
                 if(args) {
                     this.q = args;
                     this.query();
                 }
            })

        }
    }
</script>
