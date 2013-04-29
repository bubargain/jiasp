<?php


/*
 * Transfer galleryId into room type 
 * Input: id, gallery Id
 * Output: room name
 * Author: Daniel Ma  2013-04-17
 */
class IdToItem{
	/*
	 * 根据room ID来确定房间的种类
	 */
	function getRoomName($id)
	{
		switch($id)
		{
			case 1 : return 'kitchen'; break;
			case 2 : return 'bedroom';break;
			case 3 : return 'drawing';break; //客厅
			case 4 : return 'bathroom';break;
			case 5 : return 'diningroom';break;
			case 6 : return 'kidsroom';break;
			case 7 : return 'balcony';break;
			case 8 : return 'studyroom';break;
			case 9:  return 'storeroom';break;
			case 10: return 'otherParticular';break;
			case 11: return 'wholeroom';break;
			default:
				return 'others';
		}
	}
	
/*
	 * 根据size ID来确定房间的大小区间
	 */
	function getSize($id)
	{
		switch($id)
		{
			case 1 : return '小于5平'; break;
			case 2 : return '5 - 10   平';break;
			case 3 : return '10 - 20 平';break; //客厅
			case 4 : return '20 - 30 平';break;
			case 5 : return '30 - 50平';break;
			case 6 : return '大于50平';break;
			case -1: return '浮动';break;
			default:
				return 'others';
		}
	}
	
	
	/*
	 * 根据下拉框的value ID来确定硬装价格区间
	 */
	function getHardDesignCost($id)
	{
		
		switch($id)
		{
			case 1 : return '0 - 50 '; break;
			case 2 : return '50 - 100';break;
			case 3 : return '100 - 200';break; //客厅
			case 4 : return '200 - 500';break;
			case 5 : return '500 - 1000';break;
			case 6 : return '>1000 ';break;
			case -1: return '浮动';break;
			default:
				return '未知';
		}
	}
	
	
}