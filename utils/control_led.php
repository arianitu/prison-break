<?
header("Access-Control-Allow-Origin: *");
/****

Locating VID & PID
Go to the "Start" Menu.
Select "Devices and Printers"
Double-click your USB Device.
Select the "Hardware" Tab.
Select "Properties"
Select the "Details" Tab.
From the "Device description" Menu select "Hardware Ids"
Copy the numbers next to "VID_" and "PID_" (in this case, 1466 and 6A76)

****/

$deviceStrings = array(
	"0x1D34,0x0004,0",
	"0x1D34,0x0004,1",
	"0x1D34,0x0004,2"
);

$cheekExe = "C:\\wamp\\www\\subdomains\\prison-break\\utils\\DreamCheekyLED\\DreamCheekyLED.exe"; 

$deviceIdx = $_REQUEST['deviceIdx'];
$deviceString = $deviceStrings[$deviceIdx];

$command = $_REQUEST['command']; // color=red, color=green, off
echo $deviceString . " $command<br/>";

exec("$cheekExe nopause device=$deviceString $command");


?>