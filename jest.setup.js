jest.mock('NativeAnimatedHelper');
jest.mock('AnimatedImplementation', () => {
  const actualAnimatedImplementation = require.requireActual('./node_modules/react-native/Libraries/Animated/src/AnimatedImplementation.js');
  return {
    ...actualAnimatedImplementation,
    createAnimatedComponent(Component) {
      const ActualAnimatedComponent = actualAnimatedImplementation
        .createAnimatedComponent(Component);

      return class AnimatedComponent extends ActualAnimatedComponent {
        constructor(props) {
          super(props);

          this._component = {};
          this._setComponentRef = () => {
            this._prevComponent = this._component;
            this._component = {};
          };
        }
      };
    },
  };
});
