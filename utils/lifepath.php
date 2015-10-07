
<?

$digitsToFind = array(3,5,6,8);


function combineDigits($d) {
	if ( $d < 10 ) {
		return $d;
	}
	$result = 0;
	while ( $d > 1 ) {
		$result += $d%10;
		// echo "Checking: ".($d%10)."\n";
		$d/=10;
	}
	return combineDigits($result);
}

for ($idxDigitToFind = 0; $idxDigitToFind < count($digitsToFind); $idxDigitToFind++ ) {

	$searchingFor = $digitsToFind[$idxDigitToFind];
	do {
		$year = rand(1890, 1950);
		$month = rand(1,12);
		$day = rand(1,28);
		// echo "Check {$year}-{$month}-{$day}\n";
		$lifePathNumber = combineDigits($year) + combineDigits($month) + combineDigits($day);
		if ($lifePathNumber == $searchingFor) {
			echo "Found $lifePathNumber for {$year}-{$month}-{$day}\n";
			break;
		}
	} while ( true );
}
/****

1918-02-06

1+9+1+8 = 1+9 = 1 + 0 = 1
2
6

**/


?>