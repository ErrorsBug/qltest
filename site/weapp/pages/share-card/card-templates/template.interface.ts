import { ShareCardType } from '../card-service/card-type';
import { wxm } from '../../../service/wx-method.service';

export default abstract class Template {

    /**
     * 
     * @param type 本次画卡需要用什么类型，暂时只支持系列课
     * @param shareData 邀请卡的数据
     */
    constructor(type: ShareCardType, shareData: any) {}
    

    /**
     * 获得实例
     */
    public static newInstance(type: ShareCardType, shareData: any): Template { return }

    /**
     * 画卡
     * @param pos 需要画的背景的下标
     */
    abstract async draw(pos: number): Promise<string>;

    /**
     * 获取背景图的数量
     */
    abstract bgImagesCount(): number;

    /**
     * 画多行文本，各个参数看名字就懂了，现在只两行，要支持多行的话        你行的 o(￣▽￣)d
     * @param ctx 
     * @param text 
     * @param maxWidth 
     * @param lineHeight 
     * @param fontSize 
     * @param x 
     * @param y 
     */
    multiLineText(ctx: wx.CanvasContext, text: string, maxWidth: number, lineHeight: number, fontSize: number, x: number ,y: number) {
        ctx.save();
        (ctx as any).textBaseline = 'top';
        ctx.setFontSize(fontSize);

        if ((ctx as any).measureText(text).width < maxWidth) {
            ctx.fillText(text, x, y);
        } else {
            let curWidth = 0;
            let maxFontCountPerLine = Math.floor(maxWidth / fontSize);

            let line1 = text.slice(0, maxFontCountPerLine);
            let line2 = text.slice(maxFontCountPerLine, text.length);

            if (line2.length > maxFontCountPerLine - 1) {
                line2 = line2.slice(0, maxFontCountPerLine);
                line2 = line2.replace(/(\W|\w){2}$/, '...');
            }
            ctx.fillText(line1, x, y);
            ctx.fillText(line2, x, y + lineHeight);
        }

        ctx.restore();
    }

    /**
     * 以最大宽度截取后的文字，末尾加上三个点..., 如果文字小于最大宽度，将不截取
     * @param ctx 
     * @param text 文本内容
     * @param maxWidth 最大宽度
     * @returns {string} 截取后的文字
     */
    splitTextByMaxWith(ctx: wx.CanvasContext, text: string, maxWidth: number): string {
        let tempStr = '';

        for (const char of text) {
            tempStr += char;
            if ((ctx as any).measureText(tempStr).width >= maxWidth) {
                tempStr = tempStr.replace(/(\w|\W){2}$/, '...')
                break;
            }
        }

        return tempStr
    }

    /**
     * 画一个圆形的图片
     * @param ctx 
     * @param src 图片地址
     * @param x 圆形的外切圆的左上角坐标的x轴坐标
     * @param y 圆形的外切圆的左上角坐标的y轴坐标
     * @param r 圆形的半径
     */
    drawRoundImage(ctx: wx.CanvasContext, src: string, x: number, y: number, r: number) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
        (ctx as any).clip();
        ctx.drawImage(src, x, y, r * 2, r * 2);
        ctx.restore();
    }

    /**
     * 保存canvas图片，获取到本地filePath
     */
    async getTempFilePath(ctx: wx.CanvasContext, w: number, h: number): Promise<string> {
        return new Promise<string>(resolve => {
            ;(ctx as any).draw(true, () => {
                    wxm.canvasToTempFilePath({
                        canvasId: 'shareCard',
                        x: 0,
                        y: 0,
                        width: w,
                        height: h
                    }).then((result) => {
                        if (result.errMsg == 'canvasToTempFilePath:ok') {
                            resolve(result.tempFilePath);
                        } else {
                            resolve('');
                        }
                    });
                }
            );
        })
    }
}