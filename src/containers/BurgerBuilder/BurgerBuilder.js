import React, { Component } from 'react'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Burger from '../../components/Burger/Burger'
import OrderSummary from '../../components/Burger/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../hoc/Aux_'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/spinner/spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import spinner from '../../components/UI/spinner/spinner';


const INGREDIENT_PRICES = {
    salad:0.5,
    cheese:0.4,
    meat:1.3,
    bacon:0.7
};
class BurgerBuilder extends Component {

    state = {
        ingredients :null,
        totalPrice:4,
        purchasable:false,
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount () {
        axios.get('https://react-my-burger-132a1.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients:response.data})
            })
            .catch(error => {
                this.setState({error:true})
            })
    }

    purchaseHandler=()=>{
        this.setState({purchasing:true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('You continue!');
        this.setState({loading:true})
        const order ={
            ingredients:this.state.ingredients,
            price:this.state.totalPrice,
            customer:{
                name:'suraj',
                address:{
                    street:'Pune',
                    zipCode:'751024',
                    country:'India'
                },
                email:'test@test.com',
            },
            deliveryMethod:'fastest'
        }
        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading:false,purchasing:false})
            })
            .catch(error => {
                this.setState({loading:false,purchasing:false})
            });

    }

    updatePurchaseState (ingredients) {
        

        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el) =>{
            return sum + el;
        }, 0);

        this.setState({purchasable: sum > 0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1;
        
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;

        this.setState({totalPrice:newPrice,ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) =>{
        const oldCount = this.state.ingredients[type]

        if(oldCount <=0){
            return;
        }
        const updatedCount = oldCount -1;

        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;

        this.setState({totalPrice:newPrice,ingredients:updatedIngredients});
        this.updatePurchaseState(updatedIngredients);

    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner /> 
        if(this.state.ingredients){
            burger = (
                <Aux>
                    <Burger ingredients = {this.state.ingredients} />
    
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved = {this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                        purchasable={this.state.purchasable}
                    />
                </Aux>
            )
            orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />;
        }
        if(this.state.loading){
            orderSummary = <Spinner />
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary}
                </Modal>
                {burger}
                
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder,axios)
