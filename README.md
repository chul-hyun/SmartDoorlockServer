# SmartDoorlockServer
Smart Doorlock Middle Server

# DB 구조

<div id="page_content"><div>
<h2>doorlock</h2>

<table width="100%" class="print">
<tbody><tr><th width="50">컬럼명</th>
    <th width="80">종류</th>
    <th width="40">Null</th>
    <th width="70">기본값</th>
        <th>설명</th>
</tr>
    <tr class="odd">
    <td class="nowrap">
        id    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        ip    </td>
    <td class="nowrap" lang="en" dir="ltr">char(15)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="odd">
    <td class="nowrap">
        port    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        secretKey    </td>
    <td class="nowrap" lang="en" dir="ltr">char(10)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        </tbody></table>
<h3>인덱스</h3>
<table id="table_index"><thead><tr><th>키 이름</th><th>종류</th><th>고유값</th><th>압축됨</th><th>컬럼명</th><th>관계성</th><th>데이터정렬방식</th><th>Null</th><th>설명</th></tr></thead><tbody><tr class="noclick odd"><td rowspan="1">PRIMARY</td><td rowspan="1">BTREE</td><td rowspan="1">예</td><td rowspan="1">아니오</td><td>id</td><td>1</td><td>A</td><td>아니오</td><td rowspan="1"></td></tr></tbody></table></div>
    <div>
<h2>history</h2>

<table width="100%" class="print">
<tbody><tr><th width="50">컬럼명</th>
    <th width="80">종류</th>
    <th width="40">Null</th>
    <th width="70">기본값</th>
        <th>설명</th>
</tr>
    <tr class="odd">
    <td class="nowrap">
        id    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        userId    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="odd">
    <td class="nowrap">
        authtime    </td>
    <td class="nowrap" lang="en" dir="ltr">int(10)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        state    </td>
    <td lang="en" dir="ltr">enum('success', 'fail')</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        </tbody></table>
<h3>인덱스</h3>
<table id="table_index"><thead><tr><th>키 이름</th><th>종류</th><th>고유값</th><th>압축됨</th><th>컬럼명</th><th>관계성</th><th>데이터정렬방식</th><th>Null</th><th>설명</th></tr></thead><tbody><tr class="noclick odd"><td rowspan="1">PRIMARY</td><td rowspan="1">BTREE</td><td rowspan="1">예</td><td rowspan="1">아니오</td><td>id</td><td>0</td><td>A</td><td>아니오</td><td rowspan="1"></td></tr><tr class="noclick even"><td rowspan="1">user_id</td><td rowspan="1">BTREE</td><td rowspan="1">아니오</td><td rowspan="1">아니오</td><td>userId</td><td>0</td><td>A</td><td>아니오</td><td rowspan="1"></td></tr></tbody></table></div>
    <div>
<h2>setting</h2>

<table width="100%" class="print">
<tbody><tr><th width="50">컬럼명</th>
    <th width="80">종류</th>
    <th width="40">Null</th>
    <th width="70">기본값</th>
        <th>설명</th>
</tr>
    <tr class="odd">
    <td class="nowrap">
        userId    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        successAlram    </td>
    <td lang="en" dir="ltr">enum('on', 'off')</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="odd">
    <td class="nowrap">
        failAlram    </td>
    <td lang="en" dir="ltr">enum('on', 'off')</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        alarmSound    </td>
    <td class="nowrap" lang="en" dir="ltr">tinyint(4)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        </tbody></table>
<h3>인덱스</h3>
<table id="table_index"><thead><tr><th>키 이름</th><th>종류</th><th>고유값</th><th>압축됨</th><th>컬럼명</th><th>관계성</th><th>데이터정렬방식</th><th>Null</th><th>설명</th></tr></thead><tbody><tr class="noclick odd"><td rowspan="1">PRIMARY</td><td rowspan="1">BTREE</td><td rowspan="1">예</td><td rowspan="1">아니오</td><td>userId</td><td>0</td><td>A</td><td>아니오</td><td rowspan="1"></td></tr></tbody></table></div>
    <div>
<h2>user</h2>

<table width="100%" class="print">
<tbody><tr><th width="50">컬럼명</th>
    <th width="80">종류</th>
    <th width="40">Null</th>
    <th width="70">기본값</th>
        <th>설명</th>
</tr>
    <tr class="odd">
    <td class="nowrap">
        id    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        name    </td>
    <td class="nowrap" lang="en" dir="ltr">char(20)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="odd">
    <td class="nowrap">
        password    </td>
    <td class="nowrap" lang="en" dir="ltr">char(20)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        registDate    </td>
    <td class="nowrap" lang="en" dir="ltr">int(10)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="odd">
    <td class="nowrap">
        latestAuthDate    </td>
    <td class="nowrap" lang="en" dir="ltr">int(10)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        <tr class="even">
    <td class="nowrap">
        doorlockId    </td>
    <td class="nowrap" lang="en" dir="ltr">int(11)</td>
    <td>아니오</td>
    <td class="nowrap"></td>
            <td></td>
</tr>
        </tbody></table>
<h3>인덱스</h3>
<table id="table_index"><thead><tr><th>키 이름</th><th>종류</th><th>고유값</th><th>압축됨</th><th>컬럼명</th><th>관계성</th><th>데이터정렬방식</th><th>Null</th><th>설명</th></tr></thead><tbody><tr class="noclick odd"><td rowspan="1">PRIMARY</td><td rowspan="1">BTREE</td><td rowspan="1">예</td><td rowspan="1">아니오</td><td>id</td><td>10</td><td>A</td><td>아니오</td><td rowspan="1"></td></tr><tr class="noclick even"><td rowspan="1">doorlock_id</td><td rowspan="1">BTREE</td><td rowspan="1">아니오</td><td rowspan="1">아니오</td><td>doorlockId</td><td>10</td><td>A</td><td>아니오</td><td rowspan="1"></td></tr></tbody></table></div>
    <p class="print_ignore"><input type="button" class="button" id="print" value="인쇄"></p></div>
