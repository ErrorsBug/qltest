import { ShareCardType } from '../card-service/card-type';
import { createDecipher } from 'crypto';
import Template from './template.interface';
import { wxm } from '../../../service/wx-method.service';
import { getVal } from '../../../comp/util';

/**
 * 画卡模板管理
 * 
 * 1.获取实例使用  await TemplatesManager.newInstance(type: ShareCardType, shareData: any); 
 * 
 * 2.获取邀请卡数量用  instance.getAllCardCount();
 * 
 * 3.画卡用 instance.drawCard(templatePos);
 */
class TemplatesManager {

    constructor(type: ShareCardType, shareData: any) {
        this._type = type
        this._shareData = shareData;
    }

    public static templates = {
        [ShareCardType.channel]: [
            './template-01',
            './template-02',
            './template-03',
        ],

        [ShareCardType.topic]: [
            './template-01',
            './template-02',
            './template-03',
        ],

        [ShareCardType.live]: [
            './template-01',
        ],

        // 这个是分享的时候的图片，这个页面需要本地画卡然后设置成为分享的图片
        shareIconTemplate: './template-share-icon',
    }

    private _allCardList: string[] = [];

    private _templateList: Template[];

    private _type: ShareCardType;

    private _shareData: any;

    public async init() {
        try {
            const result = await Promise.all(TemplatesManager.templates[this._type].map(item => import(item)));
            const userInfo = await wxm.getUserInfo();

            this._shareData = {
                ...this._shareData,
                userName: getVal(userInfo, 'userInfo.nickName', ''),
                userHeadImage: getVal(userInfo, 'userInfo.avatarUrl', ''),
            };

            this._allCardList = result.reduce((pre, cur) => pre.concat(cur.default.bgImages), this._allCardList);
            this._templateList = result.map(item => item.default.newInstance(this._type, this._shareData));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * 推荐此方法实例化该类
     * @param type 
     */
    public static async newInstance(type: ShareCardType, shareData: any) {
        const instance = new TemplatesManager(type, shareData);
        await instance.init();

        return instance;
    }

    /**
     * 获取指定邀请卡的模板的背景图片数量
     * @param type 邀请卡的类型
     */
    public getAllCardCount(): number {
        return this._allCardList.length;
    }

    /**
     * 画指定背景图的邀请卡
     * @param templatePos 背景图片下标
     */
    public async drawCard(templatePos: number): Promise<string> {
        // 这里的templatePos是this._allCardList的下标，即所有template的背景图合起来的数组的下标，但是draw方法的参数pos是指定template里面的背景图下标
        let size = 0;
        let targetTemplate;
        let pos = 0;
        for (const template of this._templateList) {
            size = size + template.bgImagesCount()
            
            if (size > templatePos) {
                targetTemplate = template;
                pos = templatePos - (size - template.bgImagesCount());
                break;
            }
        }
        
        return await targetTemplate.draw(pos);
    }

    /**
     * 画分享的图片
     */
    public async drawShareIcon(data: any) {
        const shareIconTemplate = await import(TemplatesManager.templates.shareIconTemplate)
        const instance: Template = shareIconTemplate.default.newInstance(data);

        return await instance.draw(0);
    }
}

export default TemplatesManager;