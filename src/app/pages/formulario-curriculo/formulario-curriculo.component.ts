import { _isNumberValue } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { CepService } from 'src/app/services/cep.service';
import { Curriculo } from 'src/app/services/curriculo';
import { CurriculoList } from 'src/app/services/curriculoList';
import { CurriculosService } from 'src/app/services/curriculos.service';
import { NavigateService } from 'src/app/services/navigate.service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-formulario-curriculo',
  templateUrl: './formulario-curriculo.component.html',
  styleUrls: ['./formulario-curriculo.component.scss'],
})
export class FormularioCurriculoComponent implements OnInit {
  curriculosList: CurriculoList | undefined = undefined;
  curriculoSelected: Curriculo | undefined = undefined;
  uid: string | null = null;
  estadoCivisList = [
    'Solteiro',
    'Solteira',
    'Casado',
    'Casada',
    'Viúvo',
    'Viúva',
    'Divorciado',
    'Divorciada',
  ];
  escolaridadeList = [
    'Ensino Fundamental - Completo',
    'Ensino Fundamental - Incompleto',
    'Ensino Médio - Completo',
    'Ensino Médio - Incompleto',
    'Curso Técnico - Completo',
    'Curso Técnico - Incompleto',
    'Curso Superior - Completo',
    'Curso Superior - Incompleto',
    'Pós Graduação - Especialização - Completo',
    'Pós Graduação - Especialização - Incompleto',
    'Pós Graduação - MBA - Completo',
    'Pós Graduação - MBA - Incompleto',
    'Pós Graduação - Mestrado - Completo',
    'Pós Graduação - Mestrado - Incompleto',
    'Pós Graduação - Doutorado - Completo',
    'Pós Graduação - Doutorado - Incompleto',
  ];

  fakeData = {
    name: '',
    identifier: '',
    email: '',
    estado_civil: '',
  };

  public curriculoForm = new FormGroup({
    name: new FormControl(this.fakeData.name, [
      Validators.required,
      Validators.maxLength(35),
    ]),
    identifier: new FormControl(this.fakeData.identifier, [
      Validators.required,
      Validators.maxLength(25),
    ]),
    email: new FormControl(this.fakeData.email, [
      Validators.required,
      Validators.email,
      Validators.maxLength(30),
    ]),
    estado_civil: new FormControl(this.fakeData.estado_civil, [
      Validators.required,
      FormularioCurriculoComponent.checkCategoryInput(this.estadoCivisList),
    ]),
    data_nascimento: new FormControl(new Date(''), [
      Validators.required,
      FormularioCurriculoComponent.checkIsValidDate(),
    ]),
    nacionalidade: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]),
    telefone: new FormControl('', [
      Validators.required,
      Validators.maxLength(16),
    ]),
    whatsapp: new FormControl(false, [Validators.required]),
    cep: new FormControl('', [
      Validators.required,
      Validators.maxLength(9),
      Validators.minLength(8),
    ]),
    rua: new FormControl('', [Validators.required, Validators.maxLength(120)]),
    bairro: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    estado: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    cidade: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
    ]),
    numero: new FormControl('', [Validators.maxLength(10)]),
    complemento: new FormControl('', [Validators.maxLength(20)]),
    escolaridade: new FormControl('', [
      Validators.required,
      FormularioCurriculoComponent.checkCategoryInput(this.escolaridadeList),
    ]),
    descricao_escolaridade: new FormControl('', [
      Validators.required,
      Validators.maxLength(70),
    ]),
    cursos: new FormArray([]),
  });

  constructor(
    private curriculosService: CurriculosService,
    private route: ActivatedRoute,
    private _nav: NavigateService,
    private cepService: CepService,
    private progressBarService: ProgressBarService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.uid = this.route.snapshot.paramMap.get('id');
    this.curriculosService.curriculoList?.subscribe((userCurriculos) => {
      this.curriculosList = userCurriculos;
      this.curriculoSelected = this.curriculosList?.curriculos.filter(
        (el: any) => (el.uid = this.uid)
      )[0];
      if (this.curriculoSelected) this.preencheValoresIniciais();
      this.curriculoForm.markAllAsTouched();
    });
  }
  ngOnInit(): void {
    this.dateAdapter.setLocale({pt: 'pt'});
  }

  preencheValoresIniciais() {
    let dataStr = this.curriculoSelected!.data_nascimento!;
    dataStr = dataStr || '';
    let obj: any = {
      name: this.curriculoSelected!.name,
      identifier: this.curriculoSelected!.identifier,
      email: this.curriculoSelected!.email,
      data_nascimento: new Date(dataStr),
      estado_civil: this.curriculoSelected!.estado_civil,
      nacionalidade: this.curriculoSelected!.nacionalidade,
      telefone: this.curriculoSelected!.telefone,
      whatsapp: this.curriculoSelected!.whatsapp,
      cep: this.curriculoSelected!.cep,
      rua: this.curriculoSelected!.rua,
      bairro: this.curriculoSelected!.bairro,
      estado: this.curriculoSelected!.estado,
      cidade: this.curriculoSelected!.cidade,
      numero: this.curriculoSelected!.numero,
      complemento: this.curriculoSelected!.complemento,
      escolaridade: this.curriculoSelected!.escolaridade,
      descricao_escolaridade: this.curriculoSelected!.descricao_escolaridade,
    };
    Object.keys(obj).forEach((key) => {
      if (obj[key] === undefined) obj[key] = '';
    });
    this.curriculoForm.patchValue(obj);
    const cursos = this.curriculoSelected!.cursos;
    this.curriculoForm.controls['cursos'] = new FormArray([]);
    if (cursos?.length) {
      cursos.map((el) => {
        if (el.length) this.addCurso(el);
      });
    }
  }

  // https://www.positronx.io/create-angular-firebase-crud-app-with-angular-material/

  public static checkCategoryInput(categoryList: any[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val = control.value;
      if (categoryList.includes(val)) return null;
      return { 'not-in-list': val };
    };
  }

  public static checkIsValidDate() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const val = control.value;
      if (
        FormularioCurriculoComponent.isValidDate(new Date(val))
      )
        return null;
      return { 'not-valid-date': val };
    };
  }

  public static isValidDate(d: any) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  gravar() {
    this.progressBarService.show.next(true);
    if (this.isFormValid()) {
      const curriculo: Curriculo = {
        uid: this.uid!,
        ...this.curriculoForm.getRawValue(),
        data_nascimento: new Intl.DateTimeFormat('en-US').format(this.curriculoForm.controls['data_nascimento'].value || undefined)
      };
      curriculo.uid = curriculo.uid ? curriculo.uid : uuidv4();
      if (!this.isEditMode()) {
        this.curriculosList?.curriculos.push(curriculo);
      } else {
        const newList = this.curriculosList?.curriculos.filter(
          (el: any) => el.uid != this.uid
        );
        newList.push(curriculo);
        this.curriculoSelected = curriculo;
        this.curriculosList!.curriculos = newList;
      }
      this.curriculosService
        .updateCurriculosList(this.curriculosList)
        .then((_) => {
          this.progressBarService.show.next(false);
          this._nav.navigateTo('painel');
        })
        .catch((err) => {
          this.progressBarService.show.next(false);
          console.log({ err });
        });
    }
  }

  isEditMode() {
    return !!this.uid;
  }

  public pageTitle(): string {
    if (this.isEditMode()) {
      return 'Edição de Currículo';
    }
    return 'Cadastro de Currículo';
  }

  isFormValid() {
    return this.curriculoForm.valid;
  }
  isCepValid() {
    let cep = this.curriculoForm.value.cep!.replace('-', '');
    return cep.length == 8 && _isNumberValue(cep);
  }
  consultarCep() {
    this.progressBarService.show.next(true);
    this.cepService.getData(this.curriculoForm.value.cep!).subscribe(
      (data: any) => {
        this.curriculoForm.controls['rua'].setValue(data.street);
        this.curriculoForm.controls['bairro'].setValue(data.neighborhood);
        this.curriculoForm.controls['cidade'].setValue(data.city);
        this.curriculoForm.controls['estado'].setValue(data.state);
        this.progressBarService.show.next(false);
      },
      (err) => {
        console.log(err);
        this.progressBarService.show.next(false);
      }
    );
  }
  get cursos() {
    return this.curriculoForm.get('cursos') as FormArray;
  }

  addCurso(texto: string) {
    if (this.podeAddCurso())
      this.cursos.push(
        new FormControl(texto, [Validators.required, Validators.maxLength(50)])
      );
  }
  deleteCurso(index: number) {
    this.cursos.removeAt(index);
  }
  podeAddCurso() {
    return this.cursos.length < 3;
  }
}
