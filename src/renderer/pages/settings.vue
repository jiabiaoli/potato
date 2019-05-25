<template>
    <div>
        <div style="height: 350px">
            <Row>
                <Col span="22" offset="1">
                    <Tabs value="name1">
                        <TabPane label="秘钥" name="name1">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="APPID">
                                    <Input v-model="formItem.appId"></Input>
                                </FormItem>
                                <FormItem label="秘钥">
                                    <Input v-model="formItem.secret"></Input>
                                </FormItem>
                            </Form>
                        </TabPane>
                        <TabPane label="快捷键" name="name2">
                            <Form :model="formItem" :label-width="80">
                                <FormItem label="显示/隐藏">
                                    <Input v-model="formItem.key"></Input>
                                </FormItem>
                                <FormItem>
                                    <Checkbox v-model="formItem.plate">显示时翻译剪切板内容</Checkbox>
                                </FormItem>
                                <FormItem>
                                    <Checkbox v-model="formItem.copy">翻译完成后复制到剪切板</Checkbox>
                                </FormItem>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
        <Row>
            <Col span="22" offset="1">
                <div style="width: 100%;text-align: right;margin-right: 15px;">
                    <ButtonGroup>
                        <Button @click="save"><Icon type="md-checkmark" />保存</Button>
                        <Button @click="cancel"><Icon type="md-close" />取消</Button>
                    </ButtonGroup>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                formItem:{
                    appId:'',
                    secret:'',
                    key:'ALT+E',
                    plate:true,
                    type:'settings',
                    copy:true
                }
            }
        },methods:{
            save(){
                this.$db.findOne({type:"settings"}, (err,doc) => {
                    if(doc){
                        this.$db.update({"_id":doc._id},this.formItem)
                    }else{
                        this.$db.insert(this.formItem)
                    }
                    console.info(this)
                    console.info(this.$ipc)
                    this.$ipc.send('send-settings',this.formItem)
                    this.$ipc.send('key',this.formItem)
                })
            },cancel(){
                this.$router.push("/")
            }
        },created() {
            this.$db.findOne({type:"settings"}, (err,doc) => {
                if(doc){
                    this.formItem=doc;
                }
            })
        }
    }
</script>
