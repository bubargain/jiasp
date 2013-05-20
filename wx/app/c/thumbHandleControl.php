<?php
define("TOKEN", "ymall");
/**
 * Use to transfer  raw pictures into pre-define size
 * User: daniel ma
 * Date: 13-5-8
 * Time: 下午4:15.
 * link sample ; http://p1.yokacdn.com/pic/fashion/starwear/2013/U421P1T1D758686F9DT20130111110458.jpg
 */
class thumbHandleControl extends FrontendApp
{
    /*
     * do nothing without Parameters
     * user: daniel
     * Date: 2013-05-08
     */
    function defaultAction()
    {
         //$this->checkUrlVeirfy('http://t1.baidu.com/it/u=4110919805,649880654&fm=21&gp=0.jpg');
        //print_r($img);


    }

    /*
     * transfer all pictures in `PIC` column into thumb format and
     * @param  $width :    piture width after thumb
     * @param $length :    piture length after thumb, 0 means adjust dynamically
     * @param  $id    :    DB `text`.'id' column
     * @param  $startPos : ingore certain number of bytes in 'neirong' column and then regular match the first url
     * @return TRUE if job finished without exception , else False;
     * Date: 2013-05-09
     */
    function handlePicAction( )
    {
        /*
        * Two columns need to analysis :  `pic` & `neirong`
        */

        $cid =     isset($_GET['cid']) ? intval($_GET['cid']) : 0;
        //$startPos= isset($_GET['startPos']) ? $_GET['startPos'] : 0;
        $width=    isset($_GET['width']) ? $_GET['width'] : 480;
        $length =  isset($_GET['length']) ? $_GET['length'] : 0;


        //connect to db and find target
        $linkList = M('text',false,true);
        $sQuery = "select focus,pic,neirong from text where id=".$cid;
        $data = $linkList->getRow($sQuery);
        //var_dump($data);
        if($data == null || $data == false || $data['focus'] == 2)
        {
            echo "Column not exist";
            return false;
        }
        $CPic = $data['pic'] ;  // column pic
        $CNeirong = $data['neirong'];
        $base_img_path = realpath(ROOT_PATH . '/../../' . 'data/files/upload');
//delete one '/' here
        $path = $base_img_path  . ($cid % 200) . '/';
//var_dump($base_img_path);die(';ok');
        //parse column `neirong'
        $imgs = $this->html2Pic($CNeirong);
        $fNeirong = $CNeirong;

        for($i=0; $i<count($imgs);$i++) //对每张图片进行处理
        {
            /*
            if(strrpos($imgs[$i], 'yokacdn.com'))
                continue;
*/
            $newThumbLoc = $this->transferPicture2Thumb($imgs[$i], $width, $length, $path);//压缩图片生成，并返回地址
            if(!$newThumbLoc)
                continue;

            $newThumbLoc = str_replace($base_img_path, '', $newThumbLoc);


            //real_path($newThumbLoc);
            $finalLoc = CDNServer.'data/files/upload/' . $newThumbLoc; //final location
            if($i ==0 )
                $indexPicLoc = $finalLoc;
            $fNeirong=$this->ReplaceHTML($fNeirong,$imgs[$i],$finalLoc);

            $sQuery = "update text set pic='".$indexPicLoc."', neirong ='". addslashes($fNeirong) ."' where id =".$cid;

            $linkList->query($sQuery);
        }
        print_r("ok");
        return true;
    }

    /*
     * 在HTML中用DesLink替代rawLink
     */
    function ReplaceHTML($HTML,$rawLink,$desLink)
    {
        return str_replace($rawLink,$desLink,$HTML);
    }

    /**
     * @param $html
     * @return mixed
     * Author: jilong ,Daniel
     */
    function html2Pic($html) {
        $pat = '/<img.+?src=["|\'](http:\/\/[^"\']*)?["|\']/';
        preg_match_all($pat, $html, $imgs);
        if(empty($imgs)) {
            return array();
        }
        return $imgs[1];
    }

    /*
     *检查URL的有效性，如果需要，则模拟refer （待添加）
     *http status 404,403 etc  handling
     *later
     *author:daniel ma
     *date: 20130509
     */
    function checkUrlVerify($URL='http://p1.yokacdn.com/pic/fashion/starwear/2013/U421P1T1D758686F9DT20130111110458.jpg')
    {
        L('Snoopy');
        $snoopy = new Snoopy();
        if($snoopy->fetch($URL))
             return $snoopy->status;
        else
            return false;
    }

    /*
     * Operation function, used to transfer raw picture into thumb by picture link
     * @param $URL :   picture location
     * @param $width   thumb width
     * @param @length  thumb length
     * @param @path    picture storage location
     * @return @status 成功返回新图片路径
     * Date: 2013-05-08
     */
    function transferPicture2Thumb($URL,$width=480,$length=0,$path='/uploads/')
    {
        L('log');
        $Logging = new Log();


       if( $this->checkUrlVerify($URL) == 200) //only available when header status =200
        {

        //get thumb

            try
            {
                L('img');
                $img=new imageProcessor();

                $status = $img->make_thumb($URL,$width,$length,$path); //make thumb picture and store in Path directory
                if ($status == false)
                {
                    $Logging->write_log('ERROR',"URL:".$URL." | ".$img->error_msg,false); // record one error
                }
            }
            catch(Exception $e)
            {
                $Logging->write_log('ERROR',"URL:".$URL." | ".$e->getMessage(),false);
            }
            return  $status;
        }
        else
            return false; //URL error,ignore this operation
    }

}
