// CircularProgressWithLabel.js
import Box from '@mui/material/Box';
import GradientCircularProgress from './GradientCircularProgress';

function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <GradientCircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabel;
