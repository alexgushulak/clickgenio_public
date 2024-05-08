import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";


export default function PromptInput(props: {thumbnailText: string, handleTextbarChange: any, handleKeyPress: any, onGenerateThumbnail: any, isLoading: boolean}) {
    return (
        <div>
        <TextField
              sx={{
                borderColor: 'red'
              }}
              color='secondary'
              fullWidth={true}
              value={props.thumbnailText}
              onChange={props.handleTextbarChange}
              onKeyDown={props.handleKeyPress}
              label="Describe Your Thumbnail"
              placeholder="A Rainbow Colored Tesla Model 3 Driving Through the Mountains"
              id="outlined-multiline-flexible"
              multiline
            />
            <Button
              className="btn-hover color-10"
              variant="contained"
              onClick={props.onGenerateThumbnail}
              sx={{
                  display: props.isLoading ? "none" : "block",
                  textAlign: "center",
                  fontSize: '12px',
                  margin: "0 auto",
                  width: '100%',
                  mt: 1,
              }}
            >
            generate thumbnail (1 credit)
            </Button>
            {props.isLoading && (
              <div style={{
                marginTop: '10px',
                textTransform: "uppercase",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              </div>
            )}
        </div>
    )
}