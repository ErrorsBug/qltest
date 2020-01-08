import Template from './template.interface';
import ImageService from '../card-service/image.service';
import { CommonService } from '../../../service/common.service';
import { wxm } from '../../../service/wx-method.service';
import { ShareCardType } from '../card-service/card-type';

// 方便书写
const rpx = CommonService.rpx;

export default class Template01 extends Template {

    constructor(type: ShareCardType, shareData: any) {
        super(type, shareData);

        this.ctx = wx.createCanvasContext('shareCard');
        this._type = type;
        this._shareData = shareData;
    }

    private ctx: wx.CanvasContext;
    private _type: ShareCardType;
    private _shareData: any;

    public static bgImages: string[] = [
        'https://img.qlchat.com/qlLive/adminImg/Y54MDTKU-3H1V-AK54-1512104132921-4PL44Z9K9MID.png',
    ];

    /**
     * 推荐此方法实例化该类
     * @param type 
     */
    public static newInstance(type: ShareCardType, _shareData: any): Template01 {
        return new Template01(type, _shareData);
    }

    public bgImagesCount(): number {
        return Template01.bgImages.length;
    }

    public async draw(pos: number): Promise<string> {
        const ctx = this.ctx;
        const w = rpx`640`;
        const h = rpx`1136`;

        const [
            bgImage,
            headImage,
            userHeadImage,
            qrcode,
        ] = await Promise.all([
            ImageService.loadImage(Template01.bgImages[pos]),
            ImageService.loadImage(this._shareData.headImage),
            ImageService.loadImage(this._shareData.userHeadImage + '?x-oss-process=image/resize,h_100,w_100,m_fill,limit_0'),
            ImageService.loadImage(this._shareData.qrCode),
        ]);

        ctx.drawImage(bgImage, 0, 0, w, h);

        ctx.save();
        ctx.rotate(-1.5 * Math.PI / 180);
        ctx.drawImage(headImage, rpx`50`, rpx`80`, rpx`518`, rpx`323`);
        ctx.restore();

        // 画头像
        this.drawRoundImage(ctx, userHeadImage, rpx`40`, rpx`997`, rpx`45`);

        // 设置文字的通用属性
        ;(ctx as any).textBaseline = 'top';

        // 画SCENE那里
        ctx.save();
        ctx.setFillStyle('#ffffff');
        ctx.setFontSize(rpx`28`);
        let liveName = this.splitTextByMaxWith(ctx, this._shareData.liveName, rpx`350`);
        ctx.fillText(liveName, rpx`205`, rpx`533`);
        ctx.restore();

        // 画标题
        ctx.save();
        let channelName = this._shareData.name;
        ctx.setFillStyle('#ffd74d');
        this.multiLineText(ctx, channelName, rpx`476`, rpx`46`, rpx`36`, rpx`84`, rpx`604`);
        ctx.restore();

        // 画头像旁的文字
        ctx.save();
        ctx.setFillStyle('#ffffff');

        ctx.setFontSize(rpx`28`);
        ctx.fillText(this._shareData.userName, rpx`146`, rpx`990`);

        ctx.setFontSize(rpx`22`);
        ctx.fillText('给你推荐一堂好课', rpx`146`, rpx`1029`);
        ctx.fillText('长按识别二维码查看课程', rpx`146`, rpx`1064`);

        ctx.restore();

        ctx.save();
        ctx.drawImage(qrcode, rpx`475`, rpx`964`, rpx`120`, rpx`120`);
        ctx.restore();

        return await this.getTempFilePath(ctx, rpx`640`, rpx`1136`);
    }
}
