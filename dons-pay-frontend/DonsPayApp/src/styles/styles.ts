import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#DAA520',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonRectangle: {
    backgroundColor: '#000',
    padding: 15,
    width: '60%',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#DAA520',
    fontSize: 18,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
});