<?php
class SubPages
{
	public $m_nRows;				//每页显示的行数
	public $m_nCurRows;				//当前页能显示的行数
	public $m_nCount;				//总行数
	public $m_nCurPage;				//当前要显示的页数
	public $m_nPageCount;			//页面数量
	public $m_nMaxRow;				//当前页的最大行号
	public $m_nMinRow;				//当前页的最小行号
	public $m_bFirst;				//首页按钮是否有效
	public $m_bPrev;				//上一页按钮是否有效
	public $m_bNext;				//下一页按钮是否有效
	public $m_bLast;				//尾页按钮是否有效
	public $m_nLength;
	public $m_bStatic=false;		//是否静态化发布

	public $m_sUrl="";				//m_sUrl地址头
	public $m_sClick="";			//当Ajax调用时，a href标记响应的是onclick事件
	public $m_sPageName="page";		//page标签，用来控制m_sUrl页。比如说xxx.php?page=2中的参数Page
	public $m_sNextName='>';		//下一页
	public $m_sPrevName='<';		//上一页
	public $m_sFirstName='First';	//首页
	public $m_sLastPage='Last';		//尾页
	public $m_sPrevBar='<<';		//上一分页条
	public $m_sNextBar='>>';		//下一分页条
	public $m_sNumLeft='[';			//页数左边的格式化字符例如：[1] [2] [3] 的左边是[
	public $m_sNumRight=']';		//页数右边的格式化字符例如：[1] [2] [3] 的左边是]
	
	/*
	__construct是SubPages的构造函数
	$sUrl			分页按钮使用的URL
	$nRows 			每页显示的行数
	$nCount 		总行数
	$nCurPage		当前所在的页
	*/
	function SubPages($sUrl,$nRows,$nCount,$nCurPage=1,$click="")
	{
		$nCurPage=intval($nCurPage);
		if($nCurPage<="0")
		{
			$nCurPage=1;
		}
		if($sUrl==null || $sUrl=="")
		{
			echo "sUrl不能为空!";
			$this->SetEmpty();
			return;
		}
		$this->m_sUrl=$sUrl;
		
		$this->m_sClick=$click;
		
		$this->m_nCount=intval($nCount);
		if($this->m_nCount<1)
		{
			$this->SetEmpty();
			return;
		}
		$this->m_nRows=intval($nRows);
		if(!$nCurPage)
		{
			$this->m_nCurPage=1;
		}
		else
		{
			$this->m_nCurPage=intval($nCurPage);
		}
		$this->m_nPageCount=ceil($this->m_nCount/$this->m_nRows);
		if($this->m_nCurPage<1)
		{
			$this->m_nCurPage=1;
		}
		if($this->m_nCurPage>$this->m_nPageCount)
		{
			$this->m_nCurPage=$this->m_nPageCount;
		}
		//然后计算当前页的最小行号和最大行号
		$this->m_nMinRow=$this->m_nRows * ($this->m_nCurPage-1) + 1;
		$this->m_nMaxRow=$this->m_nMinRow + $this->m_nRows -1 ;
		if($this->m_nMaxRow > $this->m_nCount)
		{
			$this->m_nMaxRow=$this->m_nCount;
		}
		$this->m_nCurRows=$this->m_nMaxRow-$this->m_nMinRow+1;
		//再判断4个按钮是否有效
		$this->m_bFirst=false;				//首页按钮是否有效
		$this->m_bPrev=false;				//上一页按钮是否有效
		$this->m_bNext=false;				//下一页按钮是否有效
		$this->m_bLast=false;				//尾页按钮是否有效			
		if($this->m_nPageCount>1)
		{
			if($this->m_nCurPage==1)
			{
				$this->m_bNext=true;
				$this->m_bLast=true;
			}
			else if($this->m_nCurPage==$this->m_nPageCount)
			{
				$this->m_bFirst=true;
				$this->m_bPrev=true;
			}
			else
			{
				$this->m_bFirst=true;
				$this->m_bPrev=true;
				$this->m_bNext=true;
				$this->m_bLast=true;
			}
		}
		$this->m_nLength=10;
	}
 	 /*
 		__destruct析构函数
	*/
	function __destruct()
	{
		unset($this->m_nRows);
		unset($this->m_nCount);
		unset($this->m_nCurPage);
		unset($this->m_nPageCount);
		unset($this->m_nMaxRow);
		unset($this->m_nMinRow);
		unset($this->m_bFirst);
		unset($this->m_bPrev);
		unset($this->m_bNext);
		unset($this->m_bLast);		
	}
	
	function SetEmpty()
	{
		$this->m_nCurRows=0;
		$this->m_nCurPage=1;
		$this->m_nPageCount=1;
		$this->m_nMaxRow=0;
		$this->m_nMinRow=0;
		$this->m_bFirst=false;
		$this->m_bLast=false;
		$this->m_bNext=false;
		$this->m_bPrev=false;
		$this->m_nLength=10;
	}
	
	function GetLimit()
	{
		$sRet="";
		if($this->m_nCount>0)
		{
			$sRet=" limit ".($this->m_nMinRow-1).",".$this->m_nCurRows;
		}
		return $sRet;
	}
	
	function GetPageHtml()
	{
/*	
	public $m_nRows;				//每页显示的行数
	public $m_nCurRows;				//当前页能显示的行数
	public $m_nCount;				//总行数
	public $m_nCurPage;				//当前要显示的页数
	public $m_nPageCount;			//页面数量
	public $m_nMaxRow;				//当前页的最大行号
	public $m_nMinRow;				//当前页的最小行号
	public $m_bFirst;				//首页按钮是否有效
	public $m_bPrev;				//上一页按钮是否有效
	public $m_bNext;				//下一页按钮是否有效
	public $m_bLast;				//尾页按钮是否有效

	public $m_sUrl="";				//m_sUrl地址头
	public $m_sPageName="page";		//page标签，用来控制m_sUrl页。比如说xxx.php?page=2中的参数page
	public $m_sNextName='>';		//下一页
	public $m_sPrevName='<';		//上一页
	public $m_sFirstName='First';	//首页
	public $m_sLastPage='Last';		//尾页
	public $m_sPrevBar='<<';		//上一分页条
	public $m_sNextBar='>>';		//下一分页条
	public $m_sNumLeft='[';			//页数左边的格式化字符例如：[1] [2] [3] 的左边是[
	public $m_sNumRight=']';		//页数右边的格式化字符例如：[1] [2] [3] 的左边
*/
		if($this->m_nCurPage<=1)
		{
			echo '<div class="pager">';
			if($this->m_bStatic==true)
			{
				echo '<a class="reload" href="'.$this->m_sUrl.'_1.html">[Refresh]</a>';
			}
			else
			{
				echo '<a class="reload" href="'.$this->m_sUrl.'&'.$this->m_sPageName.'=1">[Refresh]</a>';
			}
			echo ' Totally <b>'.$this->m_nPageCount.'</b> Pages. Now is page <b>'.$this->m_nCurPage.'</b>.';
			if($this->m_nPageCount>1)
			{
				if($this->m_bStatic==true)
				{
					echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'_2.html">[Next]</a>';
				}
				else
				{
					echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'&'.$this->m_sPageName.'=2">[Next]</a>';							
				}
			}
			echo '</div>';
		}
		else if($this->m_nCurPage<$this->m_nPageCount)
		{
			echo '<div class="pager">';
			if($this->m_bStatic==true)
			{
				echo '<a class="reload" href="'.$this->m_sUrl.'_'.$this->m_nCurPage.'.html">[Refresh]</a>';
			}
			else
			{
				echo '<a class="reload" href="'.$this->m_sUrl.'&'.$this->m_sPageName.'='.$this->m_nCurPage.'">[Refresh]</a>';
			}		
			echo ' Totally <b>'.$this->m_nPageCount.'</b> Pages. Now is page <b>'.$this->m_nCurPage.'</b>.';
			if($this->m_bStatic==true)
			{
				echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'_'.($this->m_nCurPage-1).'.html">[Prev]</a>';
				echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'_'.($this->m_nCurPage+1).'.html">[Next]</a>';
			}
			else
			{
				echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'&'.$this->m_sPageName.'='.($this->m_nCurPage-1).'">[Prev]</a>';
				echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'&'.$this->m_sPageName.'='.($this->m_nCurPage+1).'">[Next]</a>';						
			}
			echo '</div>';
		}
		else
		{
			echo '<div class="pager">';
			
			if($this->m_bStatic==true)
			{
				echo '<a class="reload" href="'.$this->m_sUrl.'_'.$this->m_nCurPage.'.html">[Refresh]</a>';
			}
			else
			{
				echo '<a class="reload" href="'.$this->m_sUrl.'&'.$this->m_sPageName.'='.$this->m_nCurPage.'">[Refresh]</a>';
			}			
			echo ' Totally <b>'.$this->m_nPageCount.'</b> Pages. Now is page <b>'.$this->m_nCurPage.'</b>.';
			
			if($this->m_bStatic==true)
			{	
				echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'_'.($this->m_nCurPage-1).'.html">[Prev]</a>';
			}
			else
			{
				echo '&nbsp;&nbsp;<a href="'.$this->m_sUrl.'&'.$this->m_sPageName.'='.($this->m_nCurPage-1).'">[Prev]</a>';
			}
			echo '</div>';		
		}
	}
	
	function GetPageHtmlForLang($lang="")
	{
		if($lang=="" || $lang=="cn")
		{
			return $this->GetPageHtml1();
		}
		else if($lang=="en")
		{
			return $this->GetPageHtml2();			
		}
	}
	
	function GetPageHtml1()
	{
		if($this->m_bStatic==true)
		{
			if($this->m_nPageCount>1)
			{
				$pageNumber="当前第".$this->m_nCurPage."页/共".$this->m_nPageCount."页 \n";
				//显示第一页和前一页
				if ($this->m_nCurPage>1)
				{
					//第一页
					//First page		
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_1.html>第一页</A> </B> \n";
					//前一页
					//Previous page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_".($this->m_nCurPage-1).".html>前一页</A> </B> \n";
				}
				//The start number is the first number of all pages which show on the current page.
				$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
				//Prev N page
				//交界处
				if ($this->m_nCurPage>=$this->m_nLength)
				{
					$pageNumber.="[<B><A HREF=".$this->m_sUrl."_" . ($startNumber-1).".html>".($startNumber-1)."</A></B>]... \n";
				}
				$leftPageNumber=0;
				for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
				{
					if ($i==0)continue;
					if ($i-$startNumber<$this->m_nLength)
					{
						if ($i==$this->m_nCurPage)
						{
							$pageNumber.="[<b>$i</b>] \n";
						}
						else
						{
							$pageNumber.="[<A HREF=".$this->m_sUrl."_" . $i.".html>".$i."</A>] \n";
						}
					}
					else
					{
						$leftPageNumber=$this->m_nPageCount-$i+1;
						break;
					}
				}
				//显示下一个分页列表
				if ($leftPageNumber>=1)
				{
					$pageNumber.="...[<B><A HREF=".$this->m_sUrl."_" . ($startNumber+$this->m_nLength).".html>".($startNumber+$this->m_nLength)."</A></B>] \n";
				}
	
				if ($this->m_nCurPage!=$this->m_nPageCount)
				{
					//Next page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_" . ($this->m_nCurPage+1).".html>下一页</A> </B> \n";
					//Last page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_" . $this->m_nPageCount.".html>最后页</A> </B> \n";
				}
				$this->pageNumber=$pageNumber;
				return $this->pageNumber;
			}
		}
		else
		{
			if($this->m_nPageCount>1)
			{
				$pageNumber="当前第".$this->m_nCurPage."页/共".$this->m_nPageCount."页 \n";
				//显示第一页和前一页
				if ($this->m_nCurPage>1)
				{
					//第一页
					//First page		
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=1>第一页</A> </B> \n";
					//前一页
					//Previous page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage-1).">前一页</A> </B> \n";
				}
				//The start number is the first number of all pages which show on the current page.
				$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
				//Prev N page
				//交界处
				if ($this->m_nCurPage>=$this->m_nLength)
				{
					$pageNumber.="[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber-1).">".($startNumber-1)."</A></B>]... \n";
				}
				$leftPageNumber=0;
				for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
				{
					if ($i==0)continue;
					if ($i-$startNumber<$this->m_nLength)
					{
						if ($i==$this->m_nCurPage)
						{
							$pageNumber.="[<b>$i</b>] \n";
						}
						else
						{
							$pageNumber.="[<A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$i.">".$i."</A>] \n";
						}
					}
					else
					{
						$leftPageNumber=$this->m_nPageCount-$i+1;
						break;
					}
				}
				//显示下一个分页列表
				if ($leftPageNumber>=1)
				{
					$pageNumber.="...[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber+$this->m_nLength).">".($startNumber+$this->m_nLength)."</A></B>] \n";
				}
	
				if ($this->m_nCurPage!=$this->m_nPageCount)
				{
					//Next page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage+1).">下一页</A> </B> \n";
					//Last page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$this->m_nPageCount.">最后页</A> </B> \n";
				}
				$this->pageNumber=$pageNumber;
				return $this->pageNumber;
			}
		}
	}
	
	function GetPageHtml2()
	{
		if($this->m_nPageCount>1)
		{
			$pageNumber="P".$this->m_nCurPage."/".$this->m_nPageCount." \n";
			//显示第一页和前一页
			if ($this->m_nCurPage>1)
			{
				//第一页
				//First page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=1>FIRST</A> </B> \n";
				//前一页
				//Previous page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage-1).">PREV</A> </B> \n";
			}
			//The start number is the first number of all pages which show on the current page.
			$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
			//Prev N page
			//交界处
			if ($this->m_nCurPage>=$this->m_nLength)
			{
				$pageNumber.="[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber-1).">".($startNumber-1)."</A></B>]... \n";
			}
			$leftPageNumber=0;
			for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
			{
				if ($i==0)continue;
				if ($i-$startNumber<$this->m_nLength)
				{
					if ($i==$this->m_nCurPage)
					{
						$pageNumber.="[<b>$i</b>] \n";
					}
					else
					{
						$pageNumber.="[<A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$i.">".$i."</A>] \n";
					}
				}
				else
				{
					$leftPageNumber=$this->m_nPageCount-$i+1;
					break;
				}
			}
			//显示下一个分页列表
			if ($leftPageNumber>=1)
			{
				$pageNumber.="...[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber+$this->m_nLength).">".($startNumber+$this->m_nLength)."</A></B>] \n";
			}

			if ($this->m_nCurPage!=$this->m_nPageCount)
			{
				//Next page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage+1).">NEXT</A> </B> \n";
				//Last page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$this->m_nPageCount.">LAST</A> </B> \n";
			}
			$this->pageNumber=$pageNumber;
			return $this->pageNumber;
		}
	}
	
	//                            __ ____  _
	//显示第1 - 21 条记录，共2172条  << 上一页 1 2 3 4 5 6 7 8 9 10 下一页 >>   到第页  ，共104页	
	function GetPageHtml3()
	{
		if($this->m_nPageCount>1)
		{
			$pageNumber="显示第".$this->m_nMinRow." - ".$this->m_nMaxRow." 条记录，共"	.$this->m_nCount."条\n";
			if($this->m_nCurPage==0)
			{
				$pageNumber.="<<<B>上一页</B>[<b>1</b>]";
			}
			else if($this->m_nCurPage>1)
			{
				//第一页
				//First page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=1><<</A> </B> \n";
				//前一页
				//Previous page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage-1).">上一页</A> </B> \n";
			}
			//The start number is the first number of all pages which show on the current page.
			$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
			//Prev N page
			//交界处
			if ($this->m_nCurPage>=$this->m_nLength)
			{
				$pageNumber.="[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber-1).">".($startNumber-1)."</A></B>]... \n";
			}
			$leftPageNumber=0;
			for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
			{
				if ($i==0)continue;
				if ($i-$startNumber<$this->m_nLength)
				{
					if ($i==$this->m_nCurPage)
					{
						$pageNumber.="[<b>$i</b>] \n";
					}
					else
					{
						$pageNumber.="[<A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$i.">".$i."</A>] \n";
					}
				}
				else
				{
					$leftPageNumber=$this->m_nPageCount-$i+1;
					break;
				}
			}
			//显示下一个分页列表
			if ($leftPageNumber>=1)
			{
				$pageNumber.="...[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber+$this->m_nLength).">".($startNumber+$this->m_nLength)."</A></B>] \n";
			}
			if ($this->m_nCurPage!=$this->m_nPageCount)
			{
				//Next page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage+1).">下一页</A> </B> \n";
				//Last page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$this->m_nPageCount.">>></A> </B> \n";
			}
			//到第页  ，共123页 
			$pageNumber.="  到第<input name='nowpage' id='nowpage' type='text' size='2' value='".$this->m_nCurPage."' \n";
			$pageNumber.=" onKeyPress=' public code=event.KeyCode; if(code==13) \n";
			$pageNumber.="{location='".$this->m_sUrl."&".$this->m_sPageName."='+$('nowpage').value; return false;}else{return true;}'> \n";
			$pageNumber.="页，共 \n";
			$pageNumber.=$this->m_nPageCount;
			$pageNumber.="页 \n";
			$this->pageNumber=$pageNumber;
			return $this->pageNumber;
		}
	}

	function GetPageHtmlForum()
	{
		if($this->m_nPageCount>1)
		{
			$pageNumber="";
			if($this->m_nCurPage==0)
			{
				$pageNumber.="<<<B>上一页</B>[<b>1</b>]";
			}
			else if($this->m_nCurPage>1)
			{
				//第一页
				//First page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=1>[<<]</A> </B> \n";
				//前一页
				//Previous page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage-1).">上一页</A> </B> \n";
			}
			//The start number is the first number of all pages which show on the current page.
			$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
			//Prev N page
			//交界处
			if ($this->m_nCurPage>=$this->m_nLength)
			{
				$pageNumber.="[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber-1).">".($startNumber-1)."</A></B>]... \n";
			}
			$leftPageNumber=0;
			for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
			{
				if ($i==0)continue;
				if ($i-$startNumber<$this->m_nLength)
				{
					if ($i==$this->m_nCurPage)
					{
						$pageNumber.="[<b>$i</b>] \n";
					}
					else
					{
						$pageNumber.="<A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$i.">[".$i."]</A> \n";
					}
				}
				else
				{
					$leftPageNumber=$this->m_nPageCount-$i+1;
					break;
				}
			}
			//显示下一个分页列表
			if ($leftPageNumber>=1)
			{
				$pageNumber.="...[<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber+$this->m_nLength).">".($startNumber+$this->m_nLength)."</A></B>] \n";
			}
			if ($this->m_nCurPage!=$this->m_nPageCount)
			{
				//Next page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage+1).">下一页</A> </B> \n";
				//Last page
				$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$this->m_nPageCount.">[>>]</A> </B> \n";
			}
			//到第页  ，共123页 
			$pageNumber.="  到第&nbsp;<input name='nowpage' id='nowpage' type='text' size='2' value='".$this->m_nCurPage."' \n";
			$pageNumber.=" onKeyPress=\"var code=0;if(window.event){code = event.keyCode;}else if(event.which){code = event.which;}if(code==13){location='" . $this->m_sUrl . "&" . $this->m_sPageName . "='+this.value;return false;}else{return true;}\"\n";
			$pageNumber.=" style=\"width:30px;\"> \n";
			$pageNumber.="页，共";
			$pageNumber.=$this->m_nCount;
			$pageNumber.="楼/"	.$this->m_nPageCount."页\n";
			$this->pageNumber=$pageNumber;
			return $this->pageNumber;
		}
	}

	function GetPageHtml4()
	{
		if($this->m_bStatic==true)
		{
			if($this->m_nPageCount>1)
			{
				$pageNumber="".$this->m_nCurPage."/".$this->m_nPageCount." \n";
				//显示第一页和前一页
				if ($this->m_nCurPage>1)
				{
					//第一页
					//First page		
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_1.html>|<</A> </B> \n";
					//前一页
					//Previous page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_".($this->m_nCurPage-1).".html><</A> </B> \n";
				}
				//The start number is the first number of all pages which show on the current page.
				$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
				//Prev N page
				//交界处
				if ($this->m_nCurPage>=$this->m_nLength)
				{
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_" . ($startNumber-1).".html>[".($startNumber-1)."]</A></B>... \n";
				}
				$leftPageNumber=0;
				for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
				{
					if ($i==0)continue;
					if ($i-$startNumber<$this->m_nLength)
					{
						if ($i==$this->m_nCurPage)
						{
							$pageNumber.="<b>[$i]</b> \n";
						}
						else
						{
							$pageNumber.="<A HREF=".$this->m_sUrl."_" . $i.".html>[".$i."]</A> \n";
						}
					}
					else
					{
						$leftPageNumber=$this->m_nPageCount-$i+1;
						break;
					}
				}
				//显示下一个分页列表
				if ($leftPageNumber>=1)
				{
					$pageNumber.="...<B><A HREF=".$this->m_sUrl."_" . ($startNumber+$this->m_nLength).".html>[".($startNumber+$this->m_nLength)."]</A></B> \n";
				}
	
				if ($this->m_nCurPage!=$this->m_nPageCount)
				{
					//Next page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_" . ($this->m_nCurPage+1).".html>></A> </B> \n";
					//Last page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."_" . $this->m_nPageCount.".html>>|</A> </B> \n";
				}
				$this->pageNumber=$pageNumber;
				return $this->pageNumber;
			}
		}
		else
		{
			if($this->m_nPageCount>1)
			{
				$pageNumber="".$this->m_nCurPage."/".$this->m_nPageCount." \n";
				//显示第一页和前一页
				if ($this->m_nCurPage>1)
				{
					//第一页
					//First page		
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=1>|<</A> </B> \n";
					//前一页
					//Previous page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage-1)."><</A> </B> \n";
				}
				//The start number is the first number of all pages which show on the current page.
				$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
				//Prev N page
				//交界处
				if ($this->m_nCurPage>=$this->m_nLength)
				{
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber-1).">[".($startNumber-1)."]</A></B>... \n";
				}
				$leftPageNumber=0;
				for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
				{
					if ($i==0)continue;
					if ($i-$startNumber<$this->m_nLength)
					{
						if ($i==$this->m_nCurPage)
						{
							$pageNumber.="<b>[$i]</b> \n";
						}
						else
						{
							$pageNumber.="<A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$i.">[".$i."]</A> \n";
						}
					}
					else
					{
						$leftPageNumber=$this->m_nPageCount-$i+1;
						break;
					}
				}
				//显示下一个分页列表
				if ($leftPageNumber>=1)
				{
					$pageNumber.="...<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($startNumber+$this->m_nLength).">[".($startNumber+$this->m_nLength)."]</A></B> \n";
				}
	
				if ($this->m_nCurPage!=$this->m_nPageCount)
				{
					//Next page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".($this->m_nCurPage+1).">></A> </B> \n";
					//Last page
					$pageNumber.="<B><A HREF=".$this->m_sUrl."&" . $this->m_sPageName . "=".$this->m_nPageCount.">>|</A> </B> \n";
				}
				$this->pageNumber=$pageNumber;
				return $this->pageNumber;
			}
		}		
	}

	function GetPageHtmlAjax1()
	{
		if($this->m_nPageCount>1)
		{
			$pageNumber="当前第".$this->m_nCurPage."页/共".$this->m_nPageCount."页&nbsp;";
			//显示第一页和前一页
			if ($this->m_nCurPage>1)
			{
				//第一页
				//First page
				//<a href="javascript:void(0)" onclick="SetHomepage();false;">设为首页</a>
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . ",1);";
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>第一页</A></B>&nbsp;";
				//前一页
				//Previous page
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($this->m_nCurPage-1) . ");";
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>前一页</A></B>&nbsp;";
			}
			//The start number is the first number of all pages which show on the current page.
			$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
			//Prev N page
			//交界处
			if ($this->m_nCurPage>=$this->m_nLength)
			{
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($startNumber-1) . ");";
				$pageNumber.="[<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>".($startNumber-1)."</A></B>]...&nbsp;";
			}
			$leftPageNumber=0;
			for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
			{
				if ($i==0)continue;
				if ($i-$startNumber<$this->m_nLength)
				{
					if ($i==$this->m_nCurPage)
					{
						$pageNumber.="[<b>$i</b>] \n";
					}
					else
					{
						$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . $i . ");";
						$pageNumber.="[<A HREF='javascript:void(0)' onclick='" . $onclick . "'>".$i."</A>]&nbsp;";
					}
				}
				else
				{
					$leftPageNumber=$this->m_nPageCount-$i+1;
					break;
				}
			}
			//显示下一个分页列表
			if ($leftPageNumber>=1)
			{
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($startNumber+$this->m_nLength) . ");";
				$pageNumber.="...[<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>".($startNumber+$this->m_nLength)."</A></B>]&nbsp;";
			}

			if ($this->m_nCurPage!=$this->m_nPageCount)
			{
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($this->m_nCurPage+1) . ");";
				//Next page
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>下一页</A></B>&nbsp;";
				
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($this->m_nPageCount) . ");";
				//Last page
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>最后页</A></B>&nbsp;";
			}
			$this->pageNumber=$pageNumber;
			return $this->pageNumber;
		}
	}
	
	function GetPageHtmlAjax_en()
	{
		if($this->m_nPageCount>1)
		{
			$pageNumber="P".$this->m_nCurPage."/".$this->m_nPageCount."&nbsp;";
			//显示第一页和前一页
			if ($this->m_nCurPage>1)
			{
				//第一页
				//First page
				//<a href="javascript:void(0)" onclick="SetHomepage();false;">设为首页</a>
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . ",1);";
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>FIRST</A></B>&nbsp;";
				//前一页
				//Previous page
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($this->m_nCurPage-1) . ");";
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>PREV</A></B>&nbsp;";
			}
			//The start number is the first number of all pages which show on the current page.
			$startNumber=intval($this->m_nCurPage/$this->m_nLength)*$this->m_nLength;
			//Prev N page
			//交界处
			if ($this->m_nCurPage>=$this->m_nLength)
			{
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($startNumber-1) . ");";
				$pageNumber.="[<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>".($startNumber-1)."</A></B>]...&nbsp;";
			}
			$leftPageNumber=0;
			for ($i=$startNumber;$i<=$this->m_nPageCount;$i++)
			{
				if ($i==0)continue;
				if ($i-$startNumber<$this->m_nLength)
				{
					if ($i==$this->m_nCurPage)
					{
						$pageNumber.="[<b>$i</b>] \n";
					}
					else
					{
						$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . $i . ");";
						$pageNumber.="[<A HREF='javascript:void(0)' onclick='" . $onclick . "'>".$i."</A>]&nbsp;";
					}
				}
				else
				{
					$leftPageNumber=$this->m_nPageCount-$i+1;
					break;
				}
			}
			//显示下一个分页列表
			if ($leftPageNumber>=1)
			{
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($startNumber+$this->m_nLength) . ");";
				$pageNumber.="...[<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>".($startNumber+$this->m_nLength)."</A></B>]&nbsp;";
			}

			if ($this->m_nCurPage!=$this->m_nPageCount)
			{
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($this->m_nCurPage+1) . ");";
				//Next page
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>NEXT</A></B>&nbsp;";
				
				$onclick=$this->m_sClick . "(" . $this->m_sUrl . "," . ($this->m_nPageCount) . ");";
				//Last page
				$pageNumber.="<B><A HREF='javascript:void(0)' onclick='" . $onclick . "'>LAST</A></B>&nbsp;";
			}
			$this->pageNumber=$pageNumber;
			return $this->pageNumber;
		}
	}
}
?>