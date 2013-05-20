<?php

class YmallSearchService
{
    const TIME_OUT = 5;
    const SEARCH_URL = 'http://10.0.1.136:8081/ymallsearch';
    const SEARCH_FIELDS = 'id,out_url,goods_name,brand_name,add_time,last_update,default_image,price,market_price,description';

    function search($keyword, $page = 1, $page_size = 1) {
        $limit = ($page - 1) * $page_size;
        $skip = $page_size;
        $list = array();
        $r = $this->doSearch($keyword, $limit, $skip);
        $goods_count = 0;
        //读取搜索结果
        //response":{"numFound":6,"start":0,"docs":[
        if($r) {
            $r =json_decode($r);

            if($r->response) {
                //result count
                $goods_count = $r->response->numFound;

                //read result goods_data
                if($goods_count) {
                    foreach($r->response->docs as $row) {
                        $list[] = array(
                          'goods_id'=> $row->id,
                          'out_url'=> $row->out_url,
                          'goods_name'=> $row->goods_name,
                          'brand_name'=> $row->brand_name,
                          'add_time'=> $row->add_time,
                          'last_update'=> $row->last_update,
                          'default_image'=> preg_match('/^http:\/\//', $row->default_image) ? $row->default_image : 'http://mp2.yokacdn.com/' . $row->default_image,
                          'price'=> $row->price,
                          'market_price'=> $row->market_price,
                          'description'=> $row->description,
                        );
                    }
                }
            }
        }
        return $list;
    }

    private function doSearch($keyword, $limit, $skip) {
        if(!$keyword)
            return array();

        $qfs = "(goods_name:$keyword)";
        $q = urlencode($qfs);
        $sort = urlencode('views desc,score desc');
        $search_query  = '/select?indent=on&wt=json&version=2.2&facet=on&q=' . $q . '&start='.$limit.'&rows='.$skip .'&sort='. $sort .'&fl=' . self::SEARCH_FIELDS;

        //send http request
        $ch = null;
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_TIMEOUT, self::TIME_OUT);
        curl_setopt($ch, CURLOPT_URL, self::SEARCH_URL .$search_query);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $str_json = curl_exec($ch);

        curl_close($ch);
        if (empty($str_json)){
            return null;
        }

        return $str_json;
    }

    function getGoodsById($id) {
        if(!$id)
            return array();

        $qfs = "(id:$id)";
        $q = urlencode($qfs);
        $sort = urlencode('views desc,score desc');
        $search_query  = '/select?indent=on&wt=json&version=2.2&facet=on&q=' . $q . '&start=0&rows=1&sort='. $sort .'&fl=' . self::SEARCH_FIELDS;

        //send http request
        $ch = null;
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_TIMEOUT, self::TIME_OUT);
        curl_setopt($ch, CURLOPT_URL, self::SEARCH_URL .$search_query);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $str_json = curl_exec($ch);

        curl_close($ch);
        if (empty($str_json)){
            return array();
        }
        $goods = array();

        if($str_json) {
            $r =json_decode($str_json);

            if($r->response) {
                //read result goods_data
                if($r->response->numFound) {
                    foreach($r->response->docs as $row) {
                        $goods = array(
                            'goods_id'=> $row->id,
                            'out_url'=> $row->out_url,
                            'goods_name'=> $row->goods_name,
                            'brand_name'=> $row->brand_name,
                            'add_time'=> $row->add_time,
                            'last_update'=> $row->last_update,
                            'default_image'=> preg_match('/^http:\/\//', $row->default_image) ? $row->default_image : 'http://mp2.yokacdn.com/' . $row->default_image,
                            'price'=> $row->price,
                            'market_price'=> $row->market_price,
                            'description'=> $row->description,
                        );
                    }
                }
            }
        }

		if(preg_match('/[^\.|\!|\?|。|！|？|\s]\s*[,|，]?\s*$/', $goods['description']))
                $goods['description'] .= '……';

        return $goods;
    }

}